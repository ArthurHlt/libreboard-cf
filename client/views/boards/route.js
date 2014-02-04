(function() {
    Meteor.Router.add({
        "/boards": "boards",
        "/board/:_id": { to: "board", and: function(id) {

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
            if (!board) { return "loading"; }
            return page; 
        }, 

        /*
        *
        * IF USER AUTHENTICATED AND CURRENT BOARD OWNER USER THEN
        * file include ./permission.js
        */
        "permission_board": function(page) {
            if (BoardIsSessionUserThen()) { return page; }
            if (BoardIsSessionUserPublicThen()) { return page; }
            if (BoardIsNotUserPublicThen()) { return page; }
            return "index";
        }
    });

   // filter login_required pages
   Meteor.Router.filter('login_required', { only: ['boards'] }); 
   Meteor.Router.filter('board_exists', { only: "board" }); 
   Meteor.Router.filter('permission_board', { only: "board" }); 
}());

