Lists = new Mongo.Collection('lists');

Lists.allow({
    insert: function(userId, doc) {
        return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    update: function(userId, doc) {
        return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    remove: function(userId, doc) {
        return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    fetch: ['boardId']
});


Lists.helpers({
    cards: function() {
        return Cards.find({ listId: this._id, archived: false }, { sort: ['sort'] });
    },
    board: function() {
        return Boards.findOne(this.boardId);
    }
});

// HOOKS
Lists.hookOptions.after.update = { fetchPrevious: false };
Lists.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.updatedAt = new Date();
    doc.archived = false;
    if (!doc.userId) doc.userId = userId;
});


Lists.before.update(function(userId, doc, fieldNames, modifier) {
    modifier.$set.modifiedAt = new Date();
});

isServer(function() {
    Lists.after.insert(function(userId, doc) {
        Activities.insert({
            type: 'list',
            activityType: "createList",
            boardId: doc.boardId,
            listId: doc._id,
            userId: userId
        });
    });

    Lists.after.update(function(userId, doc) {
        if (doc.archived) {
            Activities.insert({
                type: 'list',
                activityType: "archivedList",
                listId: doc._id,
                boardId: doc.boardId,
                userId: userId
            });
        }
    });
});
