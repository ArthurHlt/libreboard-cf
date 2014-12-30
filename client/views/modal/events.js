Template.modal.events({
    'click .window-overlay': function(event, t) {
        Utils.goBoardId(this.board._id);
        event.preventDefault();
    },
    'click .js-close-window': function(event) {
        Utils.goBoardId(this.board._id);
        event.preventDefault();
    },
    'click .js-tab-parent': function(event, t) {
        event.stopPropagation();
    }
});
