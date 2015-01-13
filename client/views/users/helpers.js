Template.userAvatar.helpers({
    userData: function() {
        if(!this.user){
            this.user = Users.findOne(this.userId);
        }
        return this.user;
    },
    memberType: function() {
        var userId = this.userId || this.user._id;
        var user = Users.findOne(userId);
        return user && user.isBoardAdmin() ? 'admin' : 'normal';
    }
});

Avatar.options = {
    fallbackType: 'initials'
};
