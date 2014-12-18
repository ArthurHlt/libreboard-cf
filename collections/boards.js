Boards = new Mongo.Collection('boards');
Lists  = new Mongo.Collection('lists');
Cards  = new Mongo.Collection('cards');

Boards.helpers({
    lists: function() {
        return Lists.find({ boardId: this._id });       
    }
});


Lists.helpers({
    cards: function() {
        return Cards.find({ listId: this._id });
    }
});


// BOARDS BEFORE HOOK
Boards.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.closed = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
});


// LISTS BEFORE HOOK
Lists.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.userId = userId;
    doc.closed = false;
});


// CARDS BEFORE HOOK
Cards.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.userId = userId;
    doc.closed = false;
});
