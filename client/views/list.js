
if (Meteor.isClient) {
    Template.list.helpers({
        all: function() {
            return Lists.find({ board_id: Session.get("board_id")});
        },
        board: function() {
            return Boards.findOne({ slug: Session.get("board_id") });
        },
        cards: function(list_id) {
            return Cards.find({
                board_id: Session.get("board_id"),
                list_id: list_id
            });
        }
    });

    Template.list.rendered = function() {
        jQuery("body").addClass("boardPage");

        // resize board carts scrolling.
        var resize = function() {
            var body_canvas = jQuery(".board-canvas");
            body_canvas.height($(window).height() - 100);
        };

        // nitialize and resize body
        $(window).resize(resize); resize();
    };

    Template.list.events({
        "submit #ListAddForm": function(e) {
            var $this = jQuery(e.currentTarget),
                label = $this.find(".list-name-input");
           
            if (jQuery.trim(label.val())) {
                var insert_data = {
                    name: label.val(),
                    slug: slugify(label.val()),
                    board_id: Session.get("board_id")
                };
                Lists.insert(insert_data);
                label.val("");
            }
            e.preventDefault();
        },
        
        // add card
        "submit .CardAddForm": function(e) {
            var $this = jQuery(e.currentTarget),
                title = $this.find(".card-title");
           
            if (jQuery.trim(title.val())) {
                var insert_data = {
                    title: title.val(),
                    slug: slugify(title.val()),
                    board_id: Session.get("board_id"),
                    list_id: $this.data("id")
                };
                Cards.insert(insert_data);
                title.val("");
            }
            e.preventDefault();
        }
    });
}
