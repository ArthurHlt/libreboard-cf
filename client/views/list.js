
if (Meteor.isClient) {
    Template.list.helpers({
        all: function() {
            return Lists.find({ board: Session.get("list")});
        },
        board: function() {
            return Boards.findOne({ slug: Session.get("list") });
        },
        cards: function(list) {
            return Cards.find({
                board: Session.get("list"),
                list: list 
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
                    board: Session.get("list")
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
                    board: Session.get("list"),
                    list: $this.data("list")
                };
                Cards.insert(insert_data);
                title.val("");
            }
            e.preventDefault();
        }
    });
}
