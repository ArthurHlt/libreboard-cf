    
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
        "session_restart": function(page) {
            Session.set("show_pop", false);
            return page;
        }
    });
    // filter login_then pages
    Meteor.Router.filter('session_restart');
    Meteor.Router.filter('login_then', {only: ['index', "info"] }); 
}
