

/*********************************************
*
* Main.js
* 
***********************************************/

// is client then run
if (Meteor.isClient) {

    startup(function(body, addClass) {

        // add classes
        addClass("page-landing", "landing-body");
    });

    // index
    Template.index.helpers({});
    Template.index.events({});

    // header
    Template.header.helpers({
        isIndexPage: function() {
            return isPage("index");
        }, 

        isInfoPage: function() {
            return isPage("info");
        }
    });
    Template.header.events({});
}
