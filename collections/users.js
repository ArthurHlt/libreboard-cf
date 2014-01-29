
Meteor.startup(function () {
    Meteor.users.allow({
        update: function (userId, user) {  
            return userId === user._id; 
        }
    });
});

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
