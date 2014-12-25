Activities = new Mongo.Collection('activities');


Activities.helpers({
    board: function() {
        return Boards.findOne(this.boardId);
    },
    user: function() {
        return Users.findOne(this.userId);
    }
});


// ACTIVITIES BEFORE HOOK INSERT
Activities.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});
