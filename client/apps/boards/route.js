    
/*******************************************
* 
* Boards  Router
*
*******************************************/

if (Meteor.isClient) {
    Meteor.Router.add({
        "/boards": "boards",
        "/board/:_id": { to: "list", and: function(id) {

            // access parameters in order a function args too
            Session.set("currentBoardId", id);
        }}
    });

   // filter login_required pages
   Meteor.Router.filter('login_required', {only: ['boards', "list"] }); 
}
