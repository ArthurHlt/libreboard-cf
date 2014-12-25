Template.pop.events({
    'click .js-close-popover': function() {
        Utils.Pop.close();
    }
});

Template.windowOverlay.events({
    'click .window-overlay': function(event, t) {
        Utils.Overlay.close();
        Utils.Pop.close();
    },
    'click .js-close-window': function(event) {
        Utils.Overlay.close();
        Utils.Pop.close();
    },
    'click .js-tab-parent': function(event, t) {
        event.stopPropagation();
    }
});
