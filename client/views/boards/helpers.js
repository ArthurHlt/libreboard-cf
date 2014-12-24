Template.boards.helpers({
    boards: function() {
        return Boards.find({});
    }
});

Template.board.helpers({
    board: function() {
        return Boards.findOne({});
    }
});

Template.changePermissionBoardPop.helpers({
    check: function(perm) {
        return this.permission == perm;
    } 
});
