
// Collections
Cards = new Meteor.Collection("cards");

if (Meteor.isClient) {
    CardQuery = CollectionQuery.extend({
        addListCart: function(title, board_id, list_id) {
            this.collect(Cards).only(function(insert, update, remove) {
                // insert 
                insert({ 
                    title: title, 
                    board_id: board_id,
                    list_id: list_id ,
                    archive: false
                });
            });
        },
        archiveToCard: function(_id) {
            this.collect(Cards).only(function(insert, update) {
                update(_id, { archive: true });  
            });
        }
    });
}
