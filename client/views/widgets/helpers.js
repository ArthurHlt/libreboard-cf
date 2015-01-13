Template.addMemberPopup.helpers({
    isBoardMember: function() {
        var user = Users.findOne(this._id);
        return user && user.isBoardMember();
    }
});

Template.memberPopup.helpers({
    user: function() {
        return Users.findOne(this.userId);
    },
    memberType: function() {
        return Users.findOne(this.userId).isBoardAdmin() ? 'admin' : 'normal';
    }
});

Template.removeMemberPopup.helpers({
    user: function() {
        return Users.findOne(this.userId)
    },
    board: function() {
        return Boards.findOne(Router.current().params.boardId);
    }
});
