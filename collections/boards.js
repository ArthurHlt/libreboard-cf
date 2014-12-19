Boards = new Mongo.Collection('boards');


// ALLOWS
Boards.allow({
    insert: function(userId, doc) { return doc.userId === userId; },
    update: function(userId, doc) { return doc.userId === userId; },
    remove: function(userId, doc) { return doc.userId === userId; },
});


// HELPERS
Boards.helpers({
    lists: function() {
        return Lists.find({ boardId: this._id });       
    }
});


// BOARDS BEFORE HOOK
Boards.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.closed = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
});
