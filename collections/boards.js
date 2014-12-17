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
