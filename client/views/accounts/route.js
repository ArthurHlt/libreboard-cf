(function() {
    Meteor.Router.add({
        "/login": "login",
        "/signup": "signup",
        "/forgot": "forgot",

        "/:username": function(username) {
            Session.set('currentUsername', username);
            return "profile";
        }
    });
    
    Meteor.Router.filters({
        "login_required": function(page) {
            if (Meteor.user()) {
                return page;
            }
            return "index";
        },
        "login_then": function(page) {
            if (Meteor.user()) {
                return "boards";
            }
            return page;
        }
    });
    
    // filter login_then pages
    Meteor.Router.filter('login_then', {
        only: ["index", "info", 'login', "signup", "forgot"] 
    }); 
}());
