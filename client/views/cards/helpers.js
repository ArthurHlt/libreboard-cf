Template.addCardForm.helpers({});

Template.cardLabelsPop.helpers({
    isLabelSelected: function(cardId) {
      return _.contains(Cards.findOne(cardId).labelIds, this._id);
    }
});

Template.editLabelPop.helpers({
    labels: function() {
        var defaultLabels = ['green', 'yellow', 'orange', 'red', 'purple', 'blue'],
            labels = [];
        _.forEach(defaultLabels, function(color) {
            labels.push({ color: color, name: '' });
        });
        return labels;
    }
});
