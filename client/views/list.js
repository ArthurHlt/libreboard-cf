
/*********************************************
*
* List, list --> card Helpers, rendered, events
* 
***********************************************/

if (Meteor.isClient) {
    Template.list.helpers({
        all: function() {
            return Lists.find({ board_id: Session.get("board_id")});
        },
        board: function() {
            return Boards.findOne({ _id: Session.get("board_id") });
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

            // resize update canvas list height
            updateListHeight();
        };

        // nitialize and resize body
        $(window).resize(resize); resize();

        // update width area
        updateListAreaWidth(); 

        // update canvas list height
        updateListHeight();
    };

    Template.list.events({
        "click .open-card-composer": function(e) {
            var $this = jQuery(e.currentTarget),
                list = $this.parents(".list"),
                addForm = list.find(".CardAddForm");

            // click hide
            $this.hide(); addForm.fadeIn(100);

            // focus textarea
            list.find("textarea").focus();

            e.preventDefault();
        },
        "submit #ListAddForm": function(e) {
            var $this = jQuery(e.currentTarget);

            elemVal($this.find(".list-name-input"), function(elem, val, slug) {
                var insert_data = {
                    name: val,
                    slug: slug,
                    board_id: Session.get("board_id")
                };

                // insert list
                Lists.insert(insert_data);

                // update width area
                updateListAreaWidth(); 
            });     

            e.preventDefault();
        },
        
        // add card
        "submit .CardAddForm": function(e) {
            var $this = jQuery(e.currentTarget),
                list = $this.parents(".list-cards");

            elemVal($this.find(".card-title"), function(elem, val, slug) {
                var insert_data = {
                    title: val,
                    slug: slug,
                    board_id: Session.get("board_id"),
                    list_id: $this.data("id")
                };

                // insert data
                Cards.insert(insert_data);

                // focus and animate
                list.find("textarea").focus();

                // animate click textarea
                focusTextareaAnimate(list);
            });          

            e.preventDefault();
        }
    });
}
