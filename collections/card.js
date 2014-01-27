
Cards = new Meteor.Collection("cards");

CardQuerys = {
    createCard: function(data, callback) {
        Cards.insert(_.extend({
            userid: Meteor.user()._id,
            archive: false
        }, data));
        return callback && callback();
    },
};
