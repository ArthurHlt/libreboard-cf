
// Collections
Boards = new Meteor.Collection("boards");

if (Meteor.isClient) {
    BoardsQuery = CollectionQuery.extend({
        all: function() {
            return this.collect(Boards).only(function(insert, update, remove, get, all) {
                return all({});
            });
        },
        createBoard: function(title) {
            return this.collect(Boards).only(function(insert, update, remove, get, all) {
                // insert 
                return insert({ title: title, private: true});
            });
        },
        updateBoardTitle: function(title, board_id) {
            return this.collect(Boards).only(function(insert, update) {
                return update(board_id, { title: title });  
            });
        },
        updatePrivate: function(bool, board_id) {
            return this.collect(Boards).only(function(insert, update) {
                return update(board_id, { private: bool });  
            });
        }
    });
}
