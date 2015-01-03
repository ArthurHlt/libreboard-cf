Meteor.publishComposite('card', function(cardId) {
    check(cardId, String);
    return {
        find: function() {
            return Cards.find({ _id: cardId });
        }
    }
});
