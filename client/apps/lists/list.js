
/*********************************************
*
* List, list --> card Helpers, rendered, events
* 
***********************************************/

if (Meteor.isClient) {

    Helpers("list", {
        all: function() {
            return Lists.find({ board_id: Session.get("currentBoardId")});
        },
        board: function() {
            return Boards.findOne({ 
                _id: Session.get("currentBoardId"),
                // userid: Meteor.user()._id
            });
        },
        cards: function(list_id) {
            return Cards.find({
                board_id: Session.get("currentBoardId"),
                list_id: list_id
            });
        }
    });

    Rendered("list", function(addClass){
        // resize board carts scrolling.
        var resize = function() {
            var body_canvas = jQuery(".board-canvas");
            body_canvas.height($(window).height() - 100);
            // resize update canvas list height
            updateListHeight();
        };

        addClass("boardPage"); 

        // nitialize and resize body
        $(window).resize(resize); resize();

        // update width area
        updateListAreaWidth(); 

        // update canvas list height
        updateListHeight();
    });


    Template.add_list.events({
        "click .add-list": function(event, t) {
            var $this = jQuery(t.firstNode);
            $this.removeClass("idle");
            t.find(".list-name-input").focus();
        },
        "click .js-cancel-edit": function(event, template) {
            event.stopPropagation();
            event.preventDefault();
            jQuery(template.firstNode).addClass("idle");
        }
    });


    Template.list.events({
        "focus .card-title": function(event, tenplate) {
            var $this = jQuery(event.currentTarget),
                form = $this.parents(".CardAddForm"),
                not_forms = jQuery(".CardAddForm").not(form),
                list = not_forms.parents(".list");

            // not $this hide CardAddForm, all cart add show
            list.find(".js-open-card-composer").show();
        },
        "blur .card-title": function(event, template) {
            blurClickSubmit(jQuery(event.relatedTarget), function() {
                jQuery(".CardAddForm").hide();
                jQuery(".open-card-composer").show();
            });
        },
        "click .open-card-composer": function(event, template) {
            var $this = jQuery(event.currentTarget),
                list = $this.parents(".list"),
                addForm = list.find(".CardAddForm");

            // click hide focus textarea
            $this.hide(); addForm.fadeIn(100); list.find("textarea").focus();
            event.preventDefault();
        },
        "click .js-save-edit": function(event, template) {
            var form = jQuery(event.currentTarget).parents("form");
            elemVal(form.find(".list-name-input"), function(elem, title, slug) {
                ListQuery.addList(title, Session.get("currentBoardId")); 
                Meteor.setTimeout(function() {
                    jQuery(".add-list").addClass("idle");
                }, 50);
            });     
            event.preventDefault();
        },
        "click .js-rename-board": function(event, template) {
            if (PermissionBoardEdit()) {
                ShowPop("Rename Board", "rename_board");
                Meteor.setTimeout(function() {
                    jQuery(".js-board-name").focus();
                }, 200);
            }
            event.preventDefault();
        },
        "click .js-change-vis": function() {
            event.preventDefault();
            if (PermissionBoardEdit()) {
                ShowPop("Change Visibility", "permission_level");
            }
        },
        "click .js-add-card": function(e) {
            var $this = jQuery(e.currentTarget),
                form = $this.parents(".CardAddForm"),
                list = $this.parents(".list-cards");

            elemVal(form.find(".card-title"), function(elem, title, slug) {
                CardQuery.addListCart(title, Session.get("currentBoardId"), form.data("id"));

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
        "click .list-header-name": function(event, template) {
            var $this = jQuery(template.firstNode),
                list = $this.parents(".list");
            if (PermissionBoardEdit()) {
                $this.addClass("editing");
                list.find(".field").focus();
            }
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
