Template.login.helpers({});
Template.signup.helpers({});

Template.login.events({
    'submit #LoginForm': function(event) {
        
        event.preventDefault();
    }
});

Template.signup.events({
    'submit #SignUpForm': function(event) {

        event.preventDefault();
    }
});
