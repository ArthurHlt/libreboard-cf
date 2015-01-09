Boards = new Mongo.Collection('boards');

// ALLOWS
Boards.allow({
    insert: Meteor.userId,
    update: allowIsBoardAdmin,
    remove: allowIsBoardAdmin,
    fetch: ['members']
});

// We can't remove a member if it is the last administrator
Boards.deny({
    update: function(userId, doc, fieldNames, modifier) {
        if (! _.contains(fieldNames, 'members'))
            return false;

        // We only care in case of a $pull operation, ie remove a member
        if (! _.isObject(modifier.$pull && modifier.$pull.members))
            return false;

        // If there is more than one admin, it's ok to remove anyone
        var nbAdmins = _.filter(doc.members, function(member) {
            return member.isAdmin;
        }).length;
        if (nbAdmins > 1)
            return false;

        // If all the previous conditions where verified, we can't remove
        // a user if it's an admin
        var removedMemberId = modifier.$pull.members.userId;
        return !! _.findWhere(doc.members, {
            userId: removedMemberId,
            isAdmin: true
        });
    },
    fetch: ['members']
})

// HELPERS
Boards.helpers({
    lists: function() {
        return Lists.find({ boardId: this._id, archived: false }, { sort: { sort: 1 }});
    },
    activities: function() {
        return Activities.find({ boardId: this._id }, { sort: { createdAt: -1 }});
    } ,
    absoluteUrl: function() {
        return Router.path("Board", { boardId: this._id, slug: this.slug });
    }
});

// METHODS
Meteor.methods({
    removeCardMember: function(_id) {
        check(_id, String);
        CardMembers.update({ memberId: _id }, {
            $set: {
                approved: false
            }
        });
    }
});

// HOOKS
Boards.before.insert(function(userId, doc) {
    doc.slug = slugify(doc.title);
    doc.createdAt = new Date();
    doc.openWidgets = true;
    doc.archived = false;
    doc.members = [{
        userId: userId || doc.userId,
        isAdmin: true
    }];

    // Handle labels
    var defaultLabels = ['green', 'yellow', 'orange', 'red', 'purple', 'blue'];
    doc.labels = [];
    _.each(defaultLabels, function(val) {
        doc.labels.push({
            _id: Random.id(6),
            name: '',
            color: val
        });
    });
});

Boards.before.update(function(userId, doc, fieldNames, modifier) {
    if (! _.isObject(modifier.$set))
        modifier.$set = {};
    modifier.$set.modifiedAt = new Date();
});

isServer(function() {

    // Let MongoDB ensure that a member is not included twice in the same board
    Meteor.startup(function() {
        Boards._collection._ensureIndex({
            '_id': 1,
            'members.userId': 1
        }, { unique: true });
    });

    // Genesis: the first activity of the newly created board
    Boards.after.insert(function(userId, doc) {
        Activities.insert({
            type: 'board',
            activityTypeId: doc._id,
            activityType: "createBoard",
            boardId: doc._id,
            userId: userId || doc.userId
        });
    });

    // Add a new activity if we add or remove a member to the board
    Boards.after.update(function(userId, doc, fieldNames, modifier) {
        if (! _.contains(fieldNames, 'members'))
            return;

        // Say hello to the new member
        if (modifier.$push && modifier.$push.members) {
            var memberId = modifier.$push.members.userId;
            Activities.insert({
                type: 'member',
                activityType: "addBoardMember",
                boardId: doc._id,
                userId: userId,
                memberId: memberId
            });
        }

        // Say goodbye to the former member
        if (modifier.$pull && modifier.$pull.members) {
            var memberId = modifier.$pull.members.userId;
            Activities.insert({
                type: 'member',
                activityType: "removeBoardMember",
                boardId: doc._id,
                userId: userId,
                memberId: memberId
            });
        }
    });
});
