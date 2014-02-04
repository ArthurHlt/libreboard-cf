
Activities = new Meteor.Collection("activities");

if (Meteor.isServer) {
    Meteor.publish("user_activities", function(username) {
        var user = Meteor.users.findOne({ username: username });
        return Activities.find({ userid: user._id }, { sort: { createdate: -1 }});
    });
}

if (Meteor.isClient) {
    ActivitiesQuerys = {
        /*
        *
        * data : {
        *           __id: collection data id
        *           collection: 
        *           type: { insert || removed || updated },
        *           createDate: newDate,
        * };
        *  
        * Data collection name activity type. 
        */
        createActivity: function(data, callback) {
            return is_authenticated(function(user) {
                // create activity
                Activities.insert(_.extend({
                    userid: user._id,
                    createdate: new Date(), 
                }, data));       
            });
        }        
    };
}
