
/*********************************************
*
* Landing page helpers, rendered, events
* 
***********************************************/

if (Meteor.isClient) {

    Template.landing.helpers({

        // return undefined || true || false
        show_boards: function() {
            return Session.get("show_boards");
        } 
    });

    // Rendered function run add classs body
    Template.landing.rendered = function() {
        jQuery("body").addClass("landing-body");
    };

    Template.landing.events({
        "click .landing-signup-button": function(e) {
            e.preventDefault();

            // show boards template :)
            Session.set("show_boards", true); 
        }      
    });
}
