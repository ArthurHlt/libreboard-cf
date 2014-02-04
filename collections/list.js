
// Collections
Lists = new Meteor.Collection("lists");

if (Meteor.isServer) {

    Meteor.publish("lists", function(board_id) {
        return Lists.find({
            archive: false,
            board_id: board_id 
        });
    });

    Lists.allow({
        insert: function() { return !!Meteor.user(); },
        update: function(userid, list) { 
            return Meteor.user() && userid == list.userid;
        },
        remove: function(userid, list) { 
            return Meteor.user() && userid == list.userid;
        }
    });
}

if (Meteor.isClient) {
    ListQuery = {
        createList: function(data, callback) {
            return is_authenticated(function(user) {
                Lists.insert(_.extend({
                    archive: false,
                    userid: user._id,
                    createdate: new Date(),
                    rank: 999999 // ???
                }, data));
                updateListAreaWidth();                
                return callback && callback();
            });
        },
        updateList: function(list_id, data, callback) {
            return is_authenticated(function(user) {
                Lists.update({ _id: list_id }, { $set: _.extend({
                    updatedate: new Date()
                }, data)});
                return callback && callback();
            });
        },
        archiveMoveList: function(_id, callback) {
            this.updateList(_id, {
                archive: true
            }, callback);
        }
    };
}
