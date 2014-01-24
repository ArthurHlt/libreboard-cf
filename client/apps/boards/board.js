
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
            return BoardsQuery.all();
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
        "submit #CreateBoardForm": function(e, t) {
            e.preventDefault();
            var title = t.find("#boardNewTitle");
            if (trimInput(title.value)) {
                var board = BoardsQuery.addBoard(title.value);
                HidePop();
                // goto board
                page(Meteor.Router.listPath(board));
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
            var rename = template.find(".js-board-name ");
            if (trimInput(rename.value)) {
                BoardsQuery.updateBoardTitle(rename.value, Session.get("currentBoardId")); 
                HidePop();
                return;
            }
            // else focus
            jQuery(rename).focus();
        }    
    });
}
