    
/*******************************************
* 
* Javascript: Main View Router
*
*******************************************/

if (Meteor.isClient) {
    Meteor.Router.add({
        "/": "index",
        "/info": "info",
        "*": "not_found"
    });
}
