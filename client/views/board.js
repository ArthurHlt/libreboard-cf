
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
            var $this = jQuery(e.target),
                name = $this.find(".list-name-input");
            // trim and add
            if (jQuery.trim(name.val())) {
                Boards.insert({ name: name.val(), slug: slugify(name.val()) });
                name.val("");
            }
            e.preventDefault();
        },
        "click .board-list li.board": function(e) {
            var $this = jQuery(e.currentTarget),
                _id = $this.data("id");

            // trigger  list --> board slug
            Session.set("board_id", _id);
        }
    });
}
