Template.boards.helpers({
    boards: function() {
        return Boards.find({});
    },
    isStarred: function() {
        return Meteor.user().hasStarred(this._id);
    }
});

Template.board.helpers({
    board: function() {
        return Boards.findOne({});
    },
    isStarred: function() {
        var boardId = Boards.findOne()._id;
        return boardId && Meteor.user().hasStarred(boardId);
    }
});

Template.changePermissionBoardPop.helpers({
    check: function(perm) {
        return this.permission == perm;
    }
});
