Template.login.helpers({});
Template.signup.helpers({});

Template.login.events({
    'submit #LoginForm': function(event, t) {
        var email = $.trim(t.find('#email').value),
            password = $.trim(t.find('#password').value);
        
        if (email && password) {
            Meteor.loginWithPassword(email, password, function(err) {

                // show error and return false;
                if (err) { Utils.error(err); return; }

                // Redirect to Boards page
                Router.go('Boards');
            });
        }

        // submit false.
        event.preventDefault();
    }
});

Template.signup.events({
    'submit #SignUpForm': function(event, t) {
        var email = $.trim(t.find('#email').value),
            fullname = $.trim(t.find('#fullname').value),
            password = $.trim(t.find('#password').value),
            options = {
                email: email,
                password: password,
                profile: {
                    fullname: fullname
                }
            };
        
        if (email && fullname && password) {
            Accounts.createUser(options, function(err) { 
                  
                // show error and return false;
                if (err) { Utils.error(err); return; }

                // Redirect to Boards page
                Router.go('Boards');
            });
        }
        event.preventDefault();
    }
});
