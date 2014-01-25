    
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

    Meteor.Router.filters({
        /*
        *
        * IF BOARD NOT DEFINED THEN REDIRECT INDEX 
        */
        "board_exists": function(page) {
            var board = Boards.findOne({_id: Session.get("currentBoardId") });

            // Board not found then redirect index!
            if (!board) { return "index"; }
            return page; 
        }, 
        /*
        *
        * IF NOT USER AUTHENTICATED AND PRIVATE BOARD THEN 
        */
        "require_private": function(page) {
            var board = Boards.findOne({_id: Session.get("currentBoardId") });
            if (!Meteor.user() && board.private) {
                return "index"
            } 
            return page;
        }
    });

   // filter login_required pages
   Meteor.Router.filter('login_required', {only: ['boards'] }); 
   Meteor.Router.filter('board_exists', {only: "list" }); 
   Meteor.Router.filter('require_private', {only: "list" }); 
}
