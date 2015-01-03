Template.addCardForm.helpers({});

Template.cardLabelsPop.helpers({
    isLabelSelected: function(cardId) {
      return _.contains(Cards.findOne(cardId).labelIds, this._id);
    }
});
