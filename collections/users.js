Users = Meteor.users;

Users.helpers({
    boards: function(user) {
        return Boards.find({ userId: user._id });
    }
});


Users.before.insert(function (userId, doc) {

    // Username
    doc.username = slugify(doc.profile.fullname);
});
