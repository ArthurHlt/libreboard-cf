Boards = new Mongo.Collection('boards');
Lists  = new Mongo.Collection('lists');
Cards  = new Mongo.Collection('cards');


Boards.helpers({
    lists: function(board) {
        return Lists.find({ listId: board._id });       
    }
});


Lists.helpers({
    cards: function(list) {
        return Cards.find({ listId: list._id });
    }
});
