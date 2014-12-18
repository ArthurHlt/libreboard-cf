Lists  = new Mongo.Collection('lists');

Lists.helpers({
    cards: function() {
        return Cards.find({ listId: this._id });
    },
    board: function() {
        return Boards.findOne(this.boardId);
    }
});


// LISTS BEFORE HOOK
Lists.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.userId = userId;
    doc.closed = false;
});
