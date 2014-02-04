
Cards = new Meteor.Collection("cards");

if (Meteor.isServer) {

    Meteor.publish("cards", function() {
        return Cards.find({
            archive: false
        });
    });

    Cards.allow({
        insert: function() { return !!Meteor.user(); },
        update: function(userid, card) { 
            return Meteor.user() && userid == card.userid;
        },
        remove: function(userid, card) { 
            return Meteor.user() && userid == card.userid;
        },
        fetch: ["userid"]
    });
}

if (Meteor.isClient) {
    CardQuerys = {
        createCard: function(data, callback) {
            is_authenticated(function(user) {
                Cards.insert(_.extend({
                    userid: user._id,
                    archive: false,
                    datetime: new Date(),
                    rank: 99999999 // ??? 
                }, data));
                return callback && callback();
            });
        },
        updateCard: function(_id, data, callback) {
            return is_authenticated(function(user) {
                Cards.update({ _id: _id }, {$set: _.extend({
                    updatedate: new Date()
                }, data)});
            });
        },
        archiveMoveCard: function(_id, callback) {
            this.updateCard(_id, {
                archive: true 
            });
            return callback && callback();
        },
        moveToListCard: function(_id, list_id, callback) {
            var self = this;
            return is_authenticated(function() {
                self.updateCard(_id, {
                    list_id: list_id
                });
            });
        }
    };
}
