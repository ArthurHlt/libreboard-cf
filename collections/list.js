
// Collections
Lists = new Meteor.Collection("lists");

if (Meteor.isClient) {
    ListQuery = CollectionQuery.extend({
        addList: function(title, board_id) {
            this.collect(Lists).only(function(insert, update, remove) {
                // insert 
                insert({ title: title, board_id: board_id, archive: false });

                // update width area
                updateListAreaWidth(); 
            });
        },
        updateListTitle: function(list_id, title) {
            this.collect(Lists).only(function(insert, update) {
                update(list_id, { title: title });  
            });
        },
        archiveToList: function(_id) {
            this.collect(Lists).only(function(insert, update) {
                update(_id, { archive: true });  
            });
        }
    });
}
