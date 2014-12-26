Lists  = new Mongo.Collection('lists');


// ALLOWS
Lists.allow({
    insert: function(userId, doc) { 
        return allowIsBoardMember(userId, doc.boardId);
    },
    update: function(userId, doc) {
        return allowIsBoardMember(userId, doc.boardId);
    },
    remove: function(userId, doc) { 
        return allowIsBoardMember(userId, doc.boardId);
    }
});


// HELPERS
Lists.helpers({
    cards: function() {
        return Cards.find({ listId: this._id }, { sort: { sort: 1 }});
    },
    board: function() {
        return Boards.findOne(this.boardId);
    }
});


// LISTS BEFORE HOOK INSERT
Lists.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.updatedAt = new Date();
    doc.archived = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
});


// LISTS BEFORE HOOK UPDATE
Lists.before.update(function(userId, doc, fieldNames, modifier) {
    modifier.$set.modifiedAt = new Date();
});
