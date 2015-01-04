var _this = this;

// Collection
Activities = new Mongo.Collection('activities');

Activities.helpers({
    board: function() {
        return Boards.findOne(this.boardId);
    },
    user: function() {
        return Users.findOne(this.userId);
    },
    member: function() {
        return Users.findOne(this.memberId);
    },
    list: function() {
        return Lists.findOne(this.listId);
    },
    oldList: function() {
        return Lists.findOne(this.oldListId);
    },
    card: function() {
        return Cards.findOne(this.cardId);
    },
    comment: function() {
        return CardComments.findOne(this.commentId);
    }
});


// ACTIVITIES BEFORE HOOK INSERT
Activities.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});
