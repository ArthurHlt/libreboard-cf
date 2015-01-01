Users = Meteor.users;

// Search subscribe mongodb fields ['username', 'profile.fullname']
Users.initEasySearch(['username', 'profile.fullname'], {
    use: 'mongo-db'
});


// HELPERS
Users.helpers({
    boards: function() {
        return Boards.find({ userId: this._id });
    },
    hasStarred: function(boardId) {
        return this.profile.starredBoards && _.contains(this.profile.starredBoards, boardId);
    }
});


// BEFORE HOOK
Users.before.insert(function (userId, doc) {

    // connect profile.status default
    doc.profile.status = 'offline';

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
                boardId: boardId,
                userId: ExampleBoard.userId
            };

            // insert List
            Lists.insert(list);
        });
    });
});
