
// Collections
Boards = new Meteor.Collection("boards");

if (Meteor.isClient) {
    BoardsQuery = CollectionQuery.extend({
        addBoard: function(title) {
            this.collect(Boards).only(function(insert, update, remove) {
           
                // insert 
                insert({ title: title });
            });
        }
    });
}
