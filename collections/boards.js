Boards = new Mongo.Collection('boards');


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
