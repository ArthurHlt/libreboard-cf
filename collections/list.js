
// Collections
Lists = new Meteor.Collection("lists");

if (Meteor.isClient) {
    ListQuery = CollectionQuery.extend({
        addList: function(title, board_id) {
            this.collect(Lists).only(function(insert, update, remove) {
           
                // insert 
                insert({ title: title, board_id: board_id });

                // update width area
                updateListAreaWidth(); 
            });
        }
    });
}
