
if (Meteor.isServer) {
    Meteor.users.allow({
        update: function (userId, user) {  
            return userId === user._id; 
        }
    });

    Meteor.publish("get_user", function(username) {
        return Meteor.users.find({ username: username });
    });

}

if (Meteor.isClient) {
    UsersQuerys = {
        updateUser: function(data, callback) {
            return is_authenticated(function(user) {
                Meteor.users.update({ _id: user._id }, {$set: _.extend({
                     // data 
                }, data)});
                return callback && callback();
            });
        } 
    };
}
