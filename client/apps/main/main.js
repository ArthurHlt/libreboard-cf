

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

    // header
    Template.header.helpers({
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
    Template.header.events({});

    // info
    Rendered("info", function(addClass) {
        addClass("page-legal", "unknown-window");
        // initialize    
    });
}
