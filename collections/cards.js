Cards  = new Mongo.Collection('cards');

Cards.helpers({
    list: function() {
        return Cards.find({ listId: this.listId });
    },
    board: function() {
        return Boards.findOne(this.boardId);
    }
});


// CARDS BEFORE HOOK
Cards.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.userId = userId;
    doc.closed = false;
});
