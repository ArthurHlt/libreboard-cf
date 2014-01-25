
/*******************************************
* 
* Boards  Permission-Level functions
*
*******************************************/

(function() {

    BoardIsSessionUserThen = function() {
        return !!Meteor.user() && !!Boards.findOne({
            _id: Session.get("currentBoardId"),
            userid: Meteor.user()._id
        });
    };

    BoardIsSessionUserPublicThen = function() {
        return !!Meteor.user() && Boards.findOne({
            _id: Session.get("currentBoardId"),
            private: false
        });
    }

    BoardIsNotUserPublicThen = function() {
        return !Meteor.user() && Boards.findOne({
            _id: Session.get("currentBoardId"),
            private: false
        });
    }

    PermissionBoardEdit = function() {
        if (BoardIsSessionUserThen()) { return true; }
        if (BoardIsSessionUserPublicThen()) { return false; }
        if (BoardIsNotUserPublicThen()) { return false }
        return false;
    }
}());
