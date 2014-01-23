
/*********************************************
*
* Main.js
* 
***********************************************/

// is client then run
if (Meteor.isClient) {

    // index
    Template.index.helpers({});
    Template.index.events({});

    Rendered("index", function(addClass) {
        addClass("page-landing", "landing-body");
        // initialize    
    });

    Helpers("header", {
        isIndexPage: function() {
            return isPage("index");
        }, 

        isInfoPage: function() {
            return isPage("info");
        },
        show_header: function() {
            if (isPage("login") || isPage("signup") || isPage("forgot")) {
                return false;
            }
            return true;
        }
    });

    // info
    Rendered("info", function(addClass) {
        addClass("page-legal", "unknown-window");
        // initialize    
    });

    Helpers("header_user", {});
    Template.header_user.events({
        "click .js-open-add-menu": function(e) {
            e.preventDefault();
            ShowPop("title", "create_board", "pop_header_user");
        }
    });

    Helpers("pop_base", {
        pop: function() {
            return {
                show: Session.get("show_pop"),
                title: Session.get("pop_title"),
                css_klass: Session.get("pop_css_klass"),
                create_board: Session.get("pop_create_board")
            }
        }
    });

    Template.pop_base.events({
        "click .js-close-popover": function(e) {
            e.preventDefault();
            HidePop();
        }
    });
}
