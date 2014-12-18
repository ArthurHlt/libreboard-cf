Template.memberHeader.helpers({});
Template.memberHeader.events({
    'click .js-open-header-member-menu': function(event, t) {
        var user = Meteor.user(),
            label = user.profile.fullname + ' ('+ user.username +')';

        // open pop
        Utils.Pop.open('memberMenuPop', label, 973, 45);

        event.preventDefault();
    },
    'click .js-open-add-menu': function(event, t) {

        // open pop
        Utils.Pop.open('createBoardPop', 'Create Board', 973, 45);

        // return false;
        event.preventDefault(); 
    }
});

Template.memberMenuPop.events({
    'click .js-logout': function(event, t) {
        event.preventDefault();

        // Logout
        Meteor.logout(function() {
            Router.go('Home');
        });
    }
});
