
Boards = new Meteor.Collection("boards");

Meteor.startup(function () {
    Boards.allow({
        insert: function() { return !!Meteor.user(); },
        update: function(userid, board) { 
            return Meteor.user() && userid == board.userid;
        },
        remove: function(userid, board) { 
            return Meteor.user() && userid == board.userid;
        },
        fetch: ["userid"]
    });
});


BoardQuerys = {
    createBoard: function(data, callback) {
        return is_authenticated(function(user) {
            var board = Boards.insert(_.extend({
                userid: user._id,
                private: true,
                archive: false,
                createdate: new Date()
            }, data));

            // callback run
            return callback && callback(board);
        });
    },
    updateBoard: function(_id, data, callback) {
        return is_authenticated(function(user) {
            var $set = _.extend({}, data);
            Boards.update({ _id: _id }, { $set: _.extend({
                updatedate: new Date()
            }, $set) });

            // callback run
            return callback && callback();
        });
    },
    changeBoardPerm: function(_id, data, callback) {
        // _this BoardQuerys method
        return this.updateBoard.apply(this, arguments);
    }    
};
