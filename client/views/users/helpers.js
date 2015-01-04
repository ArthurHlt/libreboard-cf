Template.avatar.helpers({
    user: function() {
        return Users.findOne(this.memberId);
    },
    memberType: function() {
        var user = Users.findOne(this.memberId);
        return user && user.isBoardAdmin() ? 'admin' : 'normal';
    }
});
