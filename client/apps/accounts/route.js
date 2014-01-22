    
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
        }
    });
}
