Template.cards.rendered = function() {
    var _this = this,
        cards = _this.$(".cards");

    if (Utils.isMemberAll(true, false)) {
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

                Cards.update(data.cardId, {
                    $set: {
                        oldListId: data.oldListId,
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
                    var member = Blaze.getData(ui.draggable.get(0)).member,
                        card = Blaze.getData(this),
                        cardMember = CardMembers.findOne({ memberId: member._id, cardId: card._id });

                    if (!cardMember) {
                        // insert Member
                        CardMembers.insert({
                            memberId: member._id,
                            boardId: member.boardId,
                            cardId: card._id
                        });
                    }
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

Template.editLabelPop.rendered = function() {
    this.find('.js-autofocus').focus();
};
