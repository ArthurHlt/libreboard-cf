
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
                    insert: function(obj) {
                        return collection.insert(obj);    
                    },
                    remove: function(obj) {
                        return collection.remove(obj);
                    },
                    update: function(id, obj) {
                        return collection.update({_id: id}, {$set: obj});
                    },
                    only: function(callback) {
                        callback(this.insert, this.update, this.remove);
                    }
                }
            }
        };
    }
}());

