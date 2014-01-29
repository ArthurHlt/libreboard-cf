
// Collections
Lists = new Meteor.Collection("lists");

Lists.allow({
    insert: function() { return !!Meteor.user(); },
    update: function() { return !!Meteor.user(); },
    remove: function() { return !!Meteor.user(); }
});

if (Meteor.isClient) {
    ListQuery = {
        createList: function(data, callback) {
            return is_authenticated(function(user) {
                Lists.insert(_.extend({
                    archive: false,
                    userid: user._id,
                    createdate: new Date()
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
