
(function() {
    Meteor.methods({
        addCard: function(data) {
            return Cards.insert(_.extend({
                userid: Meteor.user()._id,
                archive: false
            }, data));
        },
        archiveToMoveCart: function(_id) {
            return Cards.update({_id: _id}, {$set: { archive: true }});
        },
        createBoard: function(data) {
            return Boards.insert(_.extend({
                userid: Meteor.user()._id,
                private: true,
                archive: false
            }, data));
        },
        updateBoard: function(data) {
            return Boards.update({_id: data._id }, { $set: { 
                title: data.title 
            }});
        },
        changeBoardPerm: function(data) {
            return Boards.update({_id: data._id }, { $set: {
                private: data.private
            }});    
        } 
    });
}());
