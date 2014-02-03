(function() {
    if (Meteor.isClient) {

        Meteor.autosubscribe(function () {
            Meteor.subscribe("get_user", Session.get("currentUsername"), function() {
                Session.set('data_loaded', true); 
            });

            Meteor.subscribe("user_activities", Session.get("currentUsername"), function() {
                Session.set('data_loaded', true); 
            }); 
        });

        // Profile,
        Helpers("profile", {
            // Current /:username Profile
            profile: function() {
                return Meteor.users.findOne();
            },
            profile_edit: function() {
                return Session.get("profile_edit");              
            }
        });

        Helpers("activities", {
            activities: function() {
               return Activities.find({});
            }
        });

        Rendered("profile", function(addClass) {
            addClass("tabbed-page");
            // rendered
        });

        Template.profile.events({
            "click .js-edit-profile": function(event, template) {
                event.preventDefault();
                Session.set("profile_edit", true);
            },
            "click .js-cancel-edit-profile": function(event, template) {
                event.preventDefault();
                Session.set("profile_edit", false);
            },
            "submit .js-profile-form": function(event, template) {
                event.preventDefault();
                var username = slugify(template.find(".username").value, ""),
                    fullname = template.find(".fullname").value,
                    bio = template.find(".bio").value,
                    username_changed,
                    user;

                //  USERNAME CHANGED AND USER GET
                user = Meteor.users.findOne({username: username});
                username_changed = (Meteor.user().username != username);

                // CONDITIONAL EXPRESSIONS
                if (!username || username.length < 3) {
                    Session.set("error_message", "Username must be at least 3 characters");
                    return;
                }
                if (!fullname) {
                    Session.set("error_message", "Full Name must be at least 1 character");
                    return;
                }
                if (username_changed && user) {
                    Session.set("error_message", "Username is taken");
                    return;
                }

                // IF USERNAME CHANGE THEN ROUTER TO /:username
                if (Meteor.user().username != username) {
                    Meteor.Router.to("/" + username);
                }

                // OK SUCCESS UPDATE USER
                UsersQuerys.updateUser({
                    username: username,
                    "profile.bio": bio,
                    "profile.fullname": fullname
                }, function() {
                    // hide && remove error
                    Session.set("profile_edit", false);
                    removeError();
                });
            }
        });
    }
}());
