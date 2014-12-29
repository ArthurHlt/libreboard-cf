Template.activities.events({
    'click .action-card': function(event, t) {
        Utils.Overlay.open({ template: 'cardDetailWindow', data: {
            cardId: this.cardId
        }});
    }
});
