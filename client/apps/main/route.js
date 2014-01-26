    
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
            return page;
        }
    });
    
    // index // info pages
    Meteor.Router.filter('session_restart');
    Meteor.Router.filter('loading');
}
