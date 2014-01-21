
/*********************************************
*
* All boards list events, rendered, helpers 
* 
***********************************************/

// is client then run
if (Meteor.isClient) {

    // helpers context
    Template.boards.helpers({
        all: function() {
            return Boards.find();
        },
        board_id: function() {
            return Session.get("board_id");
        }
    });

    // Events
    Template.boards.events({
        "submit #AddBoardForm": function(e) {
            var $this = jQuery(e.target);
            elemVal($this.find(".list-name-input"), function(elem, title) {

                BoardsQuery.addBoard(title);
            });  
            e.preventDefault();
        },
        "click .board-list li.board": function(e) {
            var $this = jQuery(e.currentTarget),
                _id = $this.data("id");

            // trigger  list --> board id
            Session.set("board_id", _id);
        }
    });
}
