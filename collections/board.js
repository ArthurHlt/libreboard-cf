

Boards = new Meteor.Collection("boards");

BoardQuerys = {
    createBoard: function(data, callback) {
        return is_authenticated(function(user) {
            var board = Boards.insert(_.extend({
                userid: user._id,
                private: true,
                archive: false
            }, data));

            // callback run
            return callback && callback(board);
        });
    },
    updateBoard: function(_id, data, callback) {
        return is_authenticated(function(user) {
            var $set = _.extend({}, data);
            Boards.update({ _id: _id }, { $set: $set });

            // callback run
            return callback && callback();
        });
    },
    changeBoardPerm: function(_id, data, callback) {
        // _this BoardQuerys method
        return this.updateBoard.apply(this, arguments);
    }    
};
