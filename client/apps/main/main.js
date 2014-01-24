
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

    // Loading Meteor.loggingIn
    Rendered("loading", function(addClass) {
        addClass("boardPage");
    });

    Helpers("header_user", {});
    Template.header_user.events({
        "click .js-open-add-menu": function(event) {
            event.preventDefault();
            ShowPop("Create Board", "create_board", "pop_header_user");
        },
        "click .js-open-header-member-menu": function(event, template) {
            var profile = Meteor.user().profile
            ShowPop(profile.fullname, "user_header_menu");
            event.preventDefault();
        }
    });

    Rendered("not_found", function(addClass) {
        addClass("page-index")
    });

    Helpers("pop_base", { 
        pop: function() {
            return PopHelper();
        }
    });

    Template.pop_base.events({
        "click .js-close-popover": function(e) {
            e.preventDefault();
            HidePop();
        }
    });
}
