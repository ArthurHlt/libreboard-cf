Lists  = new Mongo.Collection('lists');


// ALLOWS
Lists.allow({
    insert: function(userId, doc) { return doc.userId === userId; },
    update: function(userId, doc) { return doc.userId === userId; },
    remove: function(userId, doc) { return doc.userId === userId; }
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
    doc.closed = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
});


// LISTS BEFORE HOOK UPDATE
Lists.before.update(function(userId, doc, fieldNames, modifier) {
    modifier.$set.modifiedAt = new Date();
});
