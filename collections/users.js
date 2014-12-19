Users = Meteor.users;


// HELPERS
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
Users.after.insert(function(userId, doc) {
    var ExampleBoard = {
        title: 'Welcome Board',
        userId: doc._id,
        permission: 'Private' // Private || Public
    };

    // Welcome Board insert and list, card :)
    Boards.insert(ExampleBoard, function(err, boardId) {
        
        // lists
        _.forEach(['Basics', 'Advanced'], function(title) {
            var list = {
                title: title,
                boardId: boardId
            };

            // insert List
            Lists.insert({ title: title, boardId: boardId });
        });
    });
});
