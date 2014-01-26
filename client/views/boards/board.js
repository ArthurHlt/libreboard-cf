
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
        "submit #CreateBoardForm": function(e, t) {
            e.preventDefault();
            var title = t.find("#boardNewTitle");
            if (trimInput(title.value)) {
                Meteor.call("createBoard", {
                    title: title.value
                }, function(err, result) {
                    if (result) {
                        HidePop();
                        // goto board
                        page(Meteor.Router.listPath(result));
                    }    
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
            var rename = template.find(".js-board-name ");
            if (trimInput(rename.value)) {
                Meteor.call("updateBoard", {
                    _id: Session.get("currentBoardId"),
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
            // update
            Meteor.call("changeBoardPerm", {
                _id: Session.get("currentBoardId"),
                private: private
            }, function(err, result) {
                if (result) {
                    HidePop();
                }
            });
            event.preventDefault();
        }
    });
}
