
Boards = new Meteor.Collection("boards");

if (Meteor.isServer) {

    Meteor.publish("boards", function() {
        if (this.userId) {
            return Boards.find({ userid: this.userId });
        }
        return Boards.find({ private: false });
    });

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
}

if (Meteor.isClient) {
    BoardQuerys = {
        createBoard: function(data, callback) {
            return is_authenticated(function(user) {
                var board, activity;
                board = Boards.insert(_.extend({
                    userid: user._id,
                    private: true,
                    archive: false,
                    createdate: new Date()
                }, data));
                // add activity
                activity = ActivitiesQuerys.createActivity({
                    current: Boards.findOne({_id: board }),
                    collection: "boards",
                    type: "created"
                }); 
                // callback run
                return callback && callback(board, activity);
            });
        },
        updateBoard: function(_id, data, callback) {
            return is_authenticated(function(user) {
                var $set,
                    beforeObj,
                    afterObj;
                $set = _.extend({}, data);
                beforeObj = Boards.findOne({_id: _id});
                Boards.update({ _id: _id }, { $set: _.extend({
                    updatedate: new Date()
                }, $set) });
                afterObj = Boards.findOne({_id: _id});
                // callback run
                return callback && callback(beforeObj, afterObj);
            });
        },
        changeBoardPerm: function(_id, data, callback) {
            var self = this;
            return is_authenticated(function() {
                self.updateBoard(_id, data, function(beforeObj, afterObj) {
                    // add activity
                    activity = ActivitiesQuerys.createActivity({
                        before: beforeObj,
                        after: afterObj,
                        collection: "boards",
                        type: "changePerm"
                    }); 
                });
            });
        },
        updateRenameBoard: function(_id, data, callback) {
            var self = this;
            return is_authenticated(function(user) {
                self.updateBoard(_id, data, function(beforeObj, afterObj) {
                    // add activity
                    activity = ActivitiesQuerys.createActivity({
                        before: beforeObj,
                        after: afterObj,
                        collection: "boards",
                        type: "rename"
                    }); 
                });
            });
        }
    };
}
