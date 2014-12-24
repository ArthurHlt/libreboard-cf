Template.membersWidget.rendered = function() {
    if (Utils.isMemberAll(true, false)) {
        Utils.liveEvent('mouseover', function($this) {
            $this.find('.js-member').draggable({
                appendTo: "body",
                helper: "clone",
                revert: "invalid", 
                revertDuration: 150,
                snap: false,
                snapMode: "both"
            });
        });
    }
};
