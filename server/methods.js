/*
* How to Remove All Elements from a Meteor Collection
* 
* The catch is that you’re not allowed to call Post.remove({}) from the console. You’ll see
* Error: Not permitted. Untrusted code may only remove documents by ID. [403]
* Trusted Code” includes the server code and method code. 
* The key to the solution is that you can call methods defined on the Meteor server from 
* the client using the Meteor.call method.
* URL: https://teamgaslight.com/blog/how-to-remove-all-elements-from-a-meteor-collection
*/


// METHODS
Meteor.methods({
    removeCardMember: function(_id) {
        CardMembers.update({ memberId: _id }, {
            $set: {
                approved: false
            }
        });
    },
    updateCard: function(_id, $set) {
        Cards.update(_id, {
            $set: $set
        });            
    }
});
