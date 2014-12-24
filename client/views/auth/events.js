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


Template.memberHeader.events({
    'click .js-open-header-member-menu': function(event, t) {
        var user = Meteor.user(),
            label = user.profile.fullname + ' ('+ user.username +')';

        // open pop
        Utils.Pop.open('memberMenuPop', label, t.firstNode);

        // return false;
        event.preventDefault();
    },
    'click .js-open-add-menu': function(event, t) {

        // open pop
        Utils.Pop.open('createBoardPop', 'Create Board', t.firstNode);

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

Template.profileEditForm.events({
    'click .js-edit-profile': function() {
        Session.set('ProfileEditForm', true);
    },
    'click .js-cancel-edit-profile': function() {
        Session.set('ProfileEditForm', false);
    },
    'submit #ProfileEditForm': function(event, t) {
        var fullname = t.find('#fullname').value,
            bio = t.find('#bio').value;

        // trim and update
        if ($.trim(fullname)) {
            Users.update(this.profile()._id, {
                $set: {
                    'profile.fullname': fullname,
                    'profile.bio': bio
                }
            }, function() {

                // update complete close profileEditForm
                Session.set('ProfileEditForm', false);
            });
        }
        event.preventDefault();
    }
});
