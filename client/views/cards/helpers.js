Template.addCardForm.helpers({});

Template.cardMembersPop.helpers({
    isCardMember: function() {
        var cardId = Template.parentData().cardId;
        var cardMembers = Cards.findOne(cardId).members || [];
        return _.contains(cardMembers, this.userId);
    },
    user: function() {
        return Users.findOne(this.userId);
    }
});

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
