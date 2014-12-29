Boards = new Mongo.Collection('boards');
BoardMembers = new Mongo.Collection('board_members');

// ALLOWS
Boards.allow({
    insert: function(userId, doc) { return doc.userId === userId; },
    update: function(userId, doc) { return doc.userId === userId; },
    remove: function(userId, doc) { return doc.userId === userId; },
});

BoardMembers.allow({
    insert: function(userId, doc) {
        return allowMemberTypeAdmin(userId, doc.boardId);
    },
    update: function(userId, doc) {
        return allowIsBoardMember(userId, doc.boardId);
    },
    remove: function(userId, doc) {
        return allowIsBoardMember(userId, doc.boardId);
    }
});

BoardMembers.helpers({
    user: function() {
        return Users.findOne({ _id: this.userId });
    },
    board: function() {
        return Boards.findOne({ _id: this.boardId });
    }
});

// HELPERS
Boards.helpers({
    lists: function() {
        return Lists.find({ boardId: this._id, archived: false }, { sort: { sort: 1 }});
    },
    members: function() {
        return BoardMembers.find({ approved: true });
    },
    activities: function() {
        return Activities.find({ boardId: this._id }, { sort: { createdAt: -1 }});
    } 
});

BoardMembers.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});

BoardMembers.before.remove(function(userId, doc) {
    Meteor.call('removeCardMember', doc._id);
});

Boards.before.insert(function(userId, doc) {
    doc.slug = slugify(doc.title);
    doc.createdAt = new Date();
    doc.openWidgets = true;
    doc.archived = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
});

Boards.before.update(function(userId, doc, fieldNames, modifier) {
    modifier.$set.modifiedAt = new Date();
});

isServer(function() {
    Boards.after.insert(function(userId, doc) {

        // admin member insert
        BoardMembers.insert({
            boardId: doc._id,
            userId: userId,
            memberType: "admin",
            approved: true
        });

        // activity insert
        Activities.insert({
            type: 'board',
            activityTypeId: doc._id,
            activityType: "createBoard", 
            boardId: doc._id,
            userId: userId
        });
    });

    BoardMembers.after.insert(function(userId, doc) {
        Activities.insert({
            type: 'member',
            activityType: "addBoardMember", 
            boardId: doc.boardId,
            userId: userId,
            memberId: doc._id
        });
    });

    BoardMembers.after.update(function(userId, doc) {
        if (doc.approved) {
            Activities.insert({
                type: 'member',
                activityType: "addBoardMember", 
                memberId: doc._id,
                boardId: doc.boardId,
                userId: userId
            });
        }
    });
});
