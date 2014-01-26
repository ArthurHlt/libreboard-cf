    
/*******************************************
* 
* Javascript: Main View Router
*
*******************************************/

if (Meteor.isClient) {
    Meteor.Router.add({
        "/": "index",
        "/info": "info",
        "/loading": "loading",
        "*": "not_found"
    });

    Meteor.Router.filters({
        session_restart: function(page) {
            Session.set("show_pop", false);
            return page;
        },

        loading: function(page) {
            if (Meteor.loggingIn()) { return "loading"; }
            return page
        }
    });
    
    // all pages
    Meteor.Router.filter('loading');
    Meteor.Router.filter('session_restart');

    // index // info pages
    Meteor.Router.filter('login_then', {only: ['index', "info"] }); 
}
