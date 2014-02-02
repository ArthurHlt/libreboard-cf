
Activities = new Meteor.Collection("activities");

if (Meteor.isServer) {
    Meteor.publish("activities", function() {
        return Activities.find({});
    });
}
