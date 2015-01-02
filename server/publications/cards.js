Meteor.publishComposite('card', function(cardId) {
    return {
        find: function() {
            return Cards.find({ _id: cardId });
        }
    }
});
