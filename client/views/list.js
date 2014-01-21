
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

        "click .list-area-wrapper": function(e) {

            // click callback formHideAddShow
            clickWrapper(e, formHideAddShow);
        },

        "click .open-card-composer": function(e) {
            var $this = jQuery(e.currentTarget),
                list = $this.parents(".list"),
                addForm = list.find(".CardAddForm");

            // click hide focus textarea
            $this.hide(); addForm.fadeIn(100);
            list.find("textarea").focus();
            e.preventDefault();
        },

        "focus .list-name-input": formHideAddShow,
            
        "focus .card-title": function(e) {
            var $this = jQuery(e.currentTarget),
                form = $this.parents(".CardAddForm"),
                not_forms = jQuery(".CardAddForm").not(form),
                list = not_forms.parents(".list");

            // not $this hide CardAddForm, all cart add show
            not_forms.hide();
            list.find(".js-open-card-composer").show();
        },

        "submit #ListAddForm": function(e) {
            var $this = jQuery(e.currentTarget);
            elemVal($this.find(".list-name-input"), function(elem, title, slug) {
                ListQuery.addList(title, Session.get("board_id")); 
            });     
            e.preventDefault();
        },
        
        // add card
        "submit .CardAddForm": function(e) {
            var $this = jQuery(e.currentTarget),
                list = $this.parents(".list-cards");

            elemVal($this.find(".card-title"), function(elem, title, slug) {

                //insert data
                CardQuery.addListCart(title, Session.get("board_id"), $this.data("id"));

                // animate click textarea
                list.find("textarea").focus();
                focusTextareaAnimate(list);
            });          
            e.preventDefault();
        }
    });
}
