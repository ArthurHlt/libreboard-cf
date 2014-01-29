(function() {
    Meteor.Router.add({
        "/login": "login",
        "/signup": "signup",
        "/forgot": "forgot",

        "/:username": function(page) {
            // /username --> name /info /index vs --> return page
            if (!Meteor.Router[page + "Path"]) {
                Session.set('currentUsername', page);
                return "profile";
            }
            return page;
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
