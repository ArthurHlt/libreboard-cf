    
/*******************************************
* 
* Javascript: Main View Router
*
*******************************************/

if (Meteor.isClient) {
    Meteor.Router.add({
        "/": "index",
        "/info": "info",
        "/loading": "loading",
        "*": "not_found"
    });

   // filter login_then pages
   Meteor.Router.filter('login_then', {only: ['index', "info"] }); 
}
