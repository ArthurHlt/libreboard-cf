
/*********************************************
*
* All boards list events, rendered, helpers 
* 
***********************************************/

// is client then run
if (Meteor.isClient) {
    Meteor.subscribe("boards");
    Meteor.subscribe("lists");
    Meteor.subscribe("cards");

    /* ============================ ALL RENDERED ===========================*/

    /* --> BOARDS RENDERED */
    Rendered("boards", function(addClass) {
        addClass("page-index", "large-window", "tabbed-page");
    });

    Meteor.startup(function () {
    
    });

    /* --> BOARD RENDERED */
    Rendered("board", function(addClass){
        // resize board carts scrolling.
        var resize = function() {
            var body_canvas = jQuery(".board-canvas");
            body_canvas.height($(window).height() - 100);
            // resize update canvas list height
            updateListHeight();
        };

        jQuery("#surface").on("click", function(event) {
            var $this = jQuery(event.target);
            resetAddCard($this);
            resetUpdateListTitle($this);

        });

        addClass("boardPage"); $(window).resize(resize); resize();
        updateListAreaWidth(); updateListHeight();

        // IS AUTHENTICATED
        is_authenticated(function() {
       
            // LIST DRAG DROPS
            jQuery(".list-area").sortable("destroy").sortable({
                connectWith: '.list',
                items: ":not(.add-list)",
                drop: function(dragging) {
                    var wrap = jQuery(this);
                    wrap.find(".list:not(.add-list)").each(function(i) {
                        var list = jQuery(this);
                        ListQuery.updateList(list.data("id"), {
                            rank: i
                        }); 
                    });
                }
            });

            // LIST CARDS DRAG DROP
            jQuery('.list-cards').sortable("destroy").sortable({
                connectWith: '.ui-droppable',
                items: ':not(.CardAddForm)',

                // drop then update and added new ..
                drop: function(dragging, pp) {
                    var list = jQuery(this),
                        list_id = list.parents(".list").data("id");
                    list.find(".list-card").each(function(i, elem) {
                        var $this = jQuery(elem);
                        if ($this.data("id")) {
                            CardQuerys.updateCard($this.data("id"), {
                                rank: i
                            });
                        }
                    });
                    // update card move list
                    CardQuerys.moveToListCard(dragging.data("id"), list_id);
                }
            })
        });
    });

    /* ============================ ALL HELPERS ===========================*/

    /* --> BOARD HELPERS */
    Helpers("board", {
        board: function() {
            return Boards.findOne({ 
                _id: Session.get("currentBoardId")
            });
        },
        lists: function() {
            return Lists.find({ 
                board_id: Session.get("currentBoardId")
            }, {sort: ["rank","asc"]});
        },
        cards: function(list_id) {
            return Cards.find({
                list_id: list_id
            }, {sort: ["rank","asc"]});
        }
    });

    /* --> LIST_HEADER HELPERS */
    Helpers("list_header", {});

    /* --> PERMISSION HELPERS */
    Helpers("permission_level", {
        board: function() {
            return Boards.findOne({ _id: Session.get("currentBoardId") });
        }
    });

    // helpers context
    Helpers("boards", {
        all: function() {
            return Boards.find({ userid: Meteor.user()._id });
        },
        get_absolute_url: function(id) {
            return Meteor.Router.boardPath(id);
        }
    });

    /* --> RENAME BOARD HELPERS */
    Helpers("rename_board", {
        board: function() {
            return Boards.findOne({ _id: Session.get("currentBoardId") });
        }
    });


    /* ============================ ALL EVENTS ===========================*/

    /* --> CREATE BOARD EVENTS */
    Template.create_board.events({
        "submit #CreateBoardForm": function(event, template) {
            event.preventDefault();
            var title = template.find("#boardNewTitle");
            if (trimInput(title.value)) {
                BoardQuerys.createBoard({
                    title: title.value
                }, function(board) {
                    
                    // success hidePop and redirect create board.     
                    HidePop();
                    page(Meteor.Router.boardPath(board));
                });
                return;
            }
            title.focus();
        }
    });

    /* --> RENAME BOARD EVENTS */
    Template.rename_board.events({
        "submit #RenameBoardForm": function(event, template) {
            event.preventDefault();
            var rename = template.find(".js-board-name");
            if (trimInput(rename.value)) {
                BoardQuerys.updateRenameBoard(Session.get("currentBoardId"), {
                    title: rename.value
                }, function() {
                    HidePop();
                });
                return;
            }
            // else focus
            jQuery(rename).focus();
        }    
    });

    /* --> PERMISSION LEVEL EVENTS */
    Template.permission_level.events({
        "click .light-hover": function(event, template) {
            var $this = jQuery(event.currentTarget),
                private = $this.attr("name") == "private";

            BoardQuerys.changeBoardPerm(Session.get("currentBoardId"), {
                private: private
            }, function() {
                
                // success callback        
                HidePop();
            });
            event.preventDefault();
        }
    });

    /* --> ADD_LIST EVENTS */
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

    /* --> LIST_MENU EVENTS */
    Template.list_menu.events({
        "click .js-close-list": function(event, template) {
            var list = getPopElem("list", "pop_list_id"); 
            ListQuery.archiveMoveList(list.id);
            HidePop();
            event.preventDefault(); 
        } 
    });

    /* --> CARD_MENU EVENTS */
    Template.card_menu.events({
        "click .js-archive-card": function(event, template) {
            var card = getPopElem("list-card", "pop_card_id"); 
            CardQuerys.archiveMoveCard(card.id, function() {
                HidePop();
            });
            event.preventDefault(); 
        } 
    });

    /* --> LIST EVENTS */
    Template.board.events({
        'keypress .card-title': function(event, template) {
            var $this = jQuery(event.currentTarget),
                list = $this.parents(".list"),
                cards = $this.parents(".list-cards"),
                area = list.find(".js-card-title"),
                charCode = event.keyCode || event.which;
            if (charCode == 13 && trimInput(area.val())) {
                CardQuerys.createCard({
                    title: area.val(),
                    list_id: list.data("id")
                }, function() {
                    area.val(""); 
                    focusTextareaAnimate(cards);
                }); 
                event.stopPropagation();
                return false;
            }
        },
        "click .open-card-composer": function(event, template) {
            var $this = jQuery(event.currentTarget),
                list = $this.parents(".list"),
                addForm = list.find(".CardAddForm");

            jQuery(".CardAddForm").hide();
            jQuery(".open-card-composer").show();

            // click hide focus textarea
            $this.hide();
            list.find(".CardAddForm").show();
            list.find("textarea").focus();
            event.preventDefault();
        },
        "click .js-save-edit": function(event, template) {
            var form = jQuery(event.currentTarget).parents("form");
            elemVal(form.find(".list-name-input"), function(elem, title, slug) {
                ListQuery.createList({
                    title: title,
                    board_id: Session.get("currentBoardId")
                }, function() {
                    Meteor.setTimeout(function() {
                        jQuery(".add-list").addClass("idle");
                    }, 50);
                });
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
        "click .js-change-vis": function(event, template) {
            event.preventDefault();
            if (PermissionBoardEdit()) {
                ShowPop("Change Visibility", "permission_level");
            }
        },
        "click .js-add-card": function(event) {
            var $this = jQuery(event.currentTarget),
                form = $this.parents(".CardAddForm"),
                list = $this.parents(".list-cards");
            elemVal(form.find(".card-title"), function(elem, title, slug) {
                CardQuerys.createCard({
                    title: title,
                    list_id: form.data("id")
                }, function() {
                    focusTextareaAnimate(list);
                    list.find("textarea").focus();
                });
            }, function() {
            
                list.find("textarea").focus();
            });          
            event.preventDefault();
        },
        "mouseover .list-card": function(event, template) {
            var $this = jQuery(event.currentTarget);
            $this.addClass("active-card");
        },
        "mouseout .list-card": function(event, template) {
            var $this = jQuery(event.currentTarget);
            $this.removeClass("active-card");
        },
        "click .js-card-menu": function(event, template) {
            var $this = jQuery(event.currentTarget),
                card = $this.parents(".list-card");
            ShowPop("Card Actions", "card_menu", $this);  
            Session.set("pop_card_id", card.data("id"));
            event.preventDefault();
        }
    });

    /* --> LIST_HEADER EVENTS */
    Template.list_header.events({
        "click .list-header-name": function(event, template) {
            var $this = jQuery(template.firstNode),
                list = $this.parents(".list");
            if (PermissionBoardEdit()) {
                jQuery(".editable").removeClass("editing");
                $this.addClass("editing");
                jQuery(".list-area").sortable("disable");
                list.find(".field").focus();
            }
        },
        "click .js-save-edit": function(e) {
            var $this = jQuery(e.currentTarget),
                list = $this.parents(".list"),
                val = list.find(".field").val();

            if (jQuery.trim(val)) {
                ListQuery.updateList(list.data("id"), {
                    title: val
                });
            }
            e.preventDefault();
        },
        "click .js-cancel-edit": function(event, template) {
            jQuery(".editable").removeClass("editing");
            jQuery(".list-area").sortable("enable");
            event.preventDefault();
        },
        "click .js-open-list-menu": function(event, template) {
            var $this = jQuery(event.currentTarget),
                list = $this.parents(".list");
            ShowPop("List Actions", "list_menu", $this);
            Session.set("pop_list_id", list.data("id"));
            event.preventDefault();
        }
    });
}
