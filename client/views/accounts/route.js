(function() {
    Meteor.Router.add({
        "/login": "login",
        "/signup": "signup",
        "/forgot": "forgot",

        "/:username": function(page_or_username) {
            // /username --> name /info /index vs --> return page
            if (!Meteor.Router[page_or_username + "Path"]) {
                Session.set('currentUsername', page_or_username);
                return "profile";
            }
            return page_or_username;
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
