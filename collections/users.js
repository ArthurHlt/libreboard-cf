Users = Meteor.users;

Users.helpers({
    boards: function() {
        return Boards.find({ userId: this._id });
    }
});


// BEFORE HOOK
Users.before.insert(function (userId, doc) {

    // slugify to username 
    doc.username = slugify(doc.profile.fullname);
});


// AFTER HOOK
Users.after.insert(function (userId, doc) {

    // Welcome Board insert and list, card :)
    Boards.insert({ name: 'Welcome Board', userId: doc._id }, function(err, boardId) {
        // insert list and card  
    });
});
