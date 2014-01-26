    
/*******************************************
* 
* Accounts Router
*
*******************************************/

if (Meteor.isClient) {
    Meteor.Router.add({
        "/login": "login",
        "/signup": "signup",
        "/forgot": "forgot"
    });

    Meteor.Router.filters({
        "login_required": function(page) {
            if (Meteor.user()) {
                return page;
            }
            return "index";
        },
        "login_then": function(page) {
            if (Meteor.loggingIn()) { return "loading"; }
            if (Meteor.user()) {
                return "boards";
            }
            return page
        }
    });

   // filter login_then pages
   Meteor.Router.filter('login_then', {only: ['login', "signup", "forgot"] }); 
}
