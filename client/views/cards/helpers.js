Template.addCardForm.helpers({});

Template.cardDetailWindow.helpers({
    card: function() {
        return Cards.findOne(this.cardId);      
    }
})
