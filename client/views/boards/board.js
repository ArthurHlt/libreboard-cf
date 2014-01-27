
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
                var board = Boards.insert({
                    userid: Meteor.user()._id,
                    private: true,
                    archive: false,
                    title: title.value
                });
                HidePop();
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
                Boards.update({_id: Session.get("currentBoardId") }, { $set: { 
                    title: rename.value
                }});
                HidePop();
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

            Boards.update({_id: Session.get("currentBoardId") }, { $set: {
                private: private
            }});    
            HidePop();
            event.preventDefault();
        }
    });
}
