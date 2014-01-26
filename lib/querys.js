
/*********************************************
*
* Trello collects helper functions...
* 
***********************************************/

(function() {

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    if (Meteor.isClient) {
        root.CollectionQuery = {
            extend: function(obj) {
                return _.extend(obj, this);
            },
            collect: function(collection) {
                return {
                    all: function(obj) {
                        if (Meteor.user()) {
                            return collection.find(_.extend({
                                userid: Meteor.user()._id
                            }, obj));
                        }
                    },
                    get: function(obj) {
                        if (Meteor.user()) {
                            return collection.findOne(_.extend({
                                userid: Meteor.user()._id
                            }, obj));
                        }
                    },
                    insert: function(obj) {
                        if (Meteor.user()) {
                            return collection.insert(_.extend({
                                userid: Meteor.user()._id
                            }, obj));
                        }
                    },
                    remove: function(obj) {
                        if (Meteor.user()) {
                            return collection.remove(_.extend({
                                userid: Meteor.user()._id
                            }, obj));
                         }
                    },
                    update: function(id, obj) {
                        if (Meteor.user()) {
                            return collection.update({
                                _id: id
                            }, {$set: obj});
                        }
                    },
                    only: function(callback) {
                        return callback(this.insert, this.update, this.remove, this.get, this.all);
                    }
                };
            }
        };
    }
}());

