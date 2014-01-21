
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
        "focus .card-title": function(e) {
            var $this = jQuery(e.currentTarget),
                form = $this.parents(".CardAddForm"),
                not_forms = jQuery(".CardAddForm").not(form),
                list = not_forms.parents(".list");

            // not $this hide CardAddForm, all cart add show
            list.find(".js-open-card-composer").show();
        },
        "blur .card-title": function(e) {
            blurClickSubmit(jQuery(e.relatedTarget), function() {
                jQuery(".CardAddForm").hide();
                jQuery(".open-card-composer").show();
            });
        },
        "click .open-card-composer": function(e) {
            var $this = jQuery(e.currentTarget),
                list = $this.parents(".list"),
                addForm = list.find(".CardAddForm");

            // click hide focus textarea
            $this.hide(); addForm.fadeIn(100); list.find("textarea").focus();
            e.preventDefault();
        },
        "click .js-save-edit": function(e) {
            var form = jQuery(e.currentTarget).parents("form");
            elemVal(form.find(".list-name-input"), function(elem, title, slug) {
                ListQuery.addList(title, Session.get("board_id")); 
            });     
            e.preventDefault();
        },
        "click .js-add-card": function(e) {
            var $this = jQuery(e.currentTarget),
                form = $this.parents(".CardAddForm"),
                list = $this.parents(".list-cards");

            elemVal(form.find(".card-title"), function(elem, title, slug) {
                CardQuery.addListCart(title, Session.get("board_id"), form.data("id"));

                // animate click textarea
                focusTextareaAnimate(list);
                Meteor.setTimeout(function() {
                    list.find("textarea").focus();
                }, 200);
            });          
            e.preventDefault();
        }
    });

    // Board list title update
    Template.list_header.events({
        "click .list-header": function(e) {
            var $this = jQuery(e.currentTarget),
                list = $this.parents(".list");

            $this.addClass("editing");
            list.find(".field").focus();
        },

        "blur .edit textarea": function(e) {
            var $this = jQuery(e.currentTarget),
                list = $this.parents(".list");
           
            blurClickSubmit(jQuery(e.relatedTarget), function() {
                list.find(".editing").removeClass("editing");
            });
        },

        "click .js-save-edit": function(e) {
            var $this = jQuery(e.currentTarget),
                list = $this.parents(".list"),
                val = list.find(".field").val();

            if (jQuery.trim(val)) {
                ListQuery.updateListTitle(list.data("id"), val);
            }
            e.preventDefault();
        },

        "click .js-cancel-edit": function(e) {
            var $this = jQuery(e.currentTarget); 
                list = $this.parents(".list"),
                edit = list.find(".edit"),
            e.preventDefault();
        }
    });
}
