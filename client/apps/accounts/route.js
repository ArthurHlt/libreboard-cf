    
/*******************************************
* 
* Accounts Router
*
*******************************************/

if (Meteor.isClient) {
    Meteor.Router.add({
        "/login": "login",
        "/signup": "signup",
        "/forgot": "forgot"
    });
}
