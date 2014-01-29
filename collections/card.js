
Cards = new Meteor.Collection("cards");

Cards.allow({
    insert: function() { return !!Meteor.user(); },
    update: function() { return !!Meteor.user(); },
    remove: function() { return !!Meteor.user(); }
});

CardQuerys = {
    createCard: function(data, callback) {
        Cards.insert(_.extend({
            userid: Meteor.user()._id,
            archive: false,
            datetime: new Date()
        }, data));
        return callback && callback();
    },
};
