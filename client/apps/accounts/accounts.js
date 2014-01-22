

/*******************************************
* 
* Accounts
*
*******************************************/


if (Meteor.isClient) {

    Template.login.helpers({});
    Rendered("login", function(addClass) {
        addClass("account-page");
    });


    Template.signup.helpers({});
    Rendered("signup", function(addClass) {
        addClass("account-page");
    });


    Template.forgot.helpers({});
    Rendered("forgot", function(addClass) {
        addClass("account-page");
    });
}
