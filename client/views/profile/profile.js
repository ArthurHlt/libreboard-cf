(function() {
    if (Meteor.isClient) {
    
        // Profile,
        Helpers("profile", {
            
            // Current /:username Profile
            profile: function() {
                return Meteor.users.findOne({ username: Session.get("currentUsername")});
            }
        });
        Rendered("profile", function(addClass) {

            // rendered
        });

        Template.profile.events({
            // profile
        });
    }
}());
