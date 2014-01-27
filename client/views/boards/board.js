
/*********************************************
*
* All boards list events, rendered, helpers 
* 
***********************************************/

// is client then run
if (Meteor.isClient) {

    // helpers context
    Helpers("boards", {
        all: function() {
            return Boards.find({ userid: Meteor.user()._id });
        },
        get_absolute_url: function(id) {
            return Meteor.Router.listPath(id);
        }
    });

    Rendered("boards", function(addClass) {
        addClass("page-index", "large-window", "tabbed-page");
        // initial rendered
    });

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
                    page(Meteor.Router.listPath(board));
                });
                return;
            }
            title.focus();
        }
    });

    Helpers("rename_board", {
        board: function() {
            return Boards.findOne({ _id: Session.get("currentBoardId") });
        }
    });

    Template.rename_board.events({
        "submit #RenameBoardForm": function(event, template) {
            event.preventDefault();
            var rename = template.find(".js-board-name");
            if (trimInput(rename.value)) {
                BoardQuerys.updateBoard(Session.get("currentBoardId"), {
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

    Helpers("permission_level", {
        board: function() {
            return Boards.findOne({ _id: Session.get("currentBoardId") });
        }
    });

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
}
