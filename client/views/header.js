
// is client then run
if (Meteor.isClient) {

    Template.header.helpers({
        board: function() {
            return Boards.findOne({ _id: Session.get("board_id")});
        }
    });


    Template.header.events({
        "click .header-boards": function(e) {
            
            Session.set("board_id", false);
            jQuery("body").removeClass("boardPage");
            e.preventDefault();     
        }
    });
}
