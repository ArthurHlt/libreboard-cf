Template.cards.rendered = function() {
    var _this = this,
        cards = _this.$(".cards");

    if (Meteor.user().isBoardMember()) {
        cards.sortable({
            connectWith: ".js-sortable",
            tolerance: 'pointer',
            appendTo: 'body',
            helper: "clone",
            items: '.list-card:not(.placeholder, .hide, .js-composer)',
            placeholder: 'list-card placeholder',
            start: function (event, ui) {
                $('.list-card.placeholder').height(ui.item.height());
            },
            stop: function(event, ui) {
                var data = new Utils.getCardData(ui.item);

                // XXX For some reason, running the latency compensation method
                // on the client randomly raise a bug (#61) in which the drag
                // and drop operation is visually reversed after a moment -- but
                // the document is correctly updated and a page refresh shows it
                // correctly. It seems to happen when the server overwrite the
                // latency compensated result in the DOM.
                // The hack used here is to skirt the client operation by
                // directly calling the server underlined method.
                Meteor.call('/cards/update', {_id: data.cardId}, {
                    $set: {
                        listId: data.listId,
                        sort: data.sort
                    }
                });
            }
        }).disableSelection();

        Utils.liveEvent('mouseover', function($this) {
            $this.find('.card').droppable({
                hoverClass: "active-card",
                accept: '.js-member',
                drop: function(event, ui) {
                    var memberId = Blaze.getData(ui.draggable.get(0)).memberId;
                    var cardId = Blaze.getData(this)._id;
                    Cards.update(cardId, {$addToSet: { members: memberId}});
                }
            });
        });
    }

    // update height add, update, remove resize board height.
    Cards.find().observe({
        added: Utils.resizeHeight('.board-canvas'),
        updated: Utils.resizeHeight('.board-canvas'),
        removed: Utils.resizeHeight('.board-canvas')
    });
};

Template.formLabel.rendered = function() {
    this.find('.js-autofocus').focus();
};

Template.cardMorePopup.rendered = function() {
    this.find('.js-autoselect').select();
};
