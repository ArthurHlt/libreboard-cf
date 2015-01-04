Template.addMemberPop.helpers({
    isBoardMember: function() {
        var user = Users.findOne(this._id);
        return user && user.isBoardMember();
    }
});

Template.memberPop.helpers({
    user: function() {
        return Users.findOne(this.memberId)
    },
    memberType: function() {
        return Users.findOne(this.memberId).isBoardAdmin() ? 'admin' : 'normal';
    }
});
