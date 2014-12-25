Template.addCardForm.helpers({});

Template.cardDetailWindow.helpers({

    // live card 
    card: function() {
        return Cards.findOne(this.cardId);      
    }
})
