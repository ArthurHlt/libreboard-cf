Template.cards.rendered = function() {
    var _this = this,
        data = this.data,
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
                var list = ui.item.parents('.list-cards'),
                    data = Blaze.getData(list.get(0));

                // each cards
                list.find('.card').each(function(i, el) {
                    var card = Blaze.getData(el);

                    // update collection 
                    Cards.update(card._id, {
                        $set: {
                            sort: i,
                            listId: data.listId
                        }
                    });
                });
            }
        }).disableSelection();

        Utils.liveEvent('mouseover', function($this) {
            $this.find('.card').droppable({
                hoverClass: "active-card",
                accept: '.js-member',
                drop: function(event, ui) {
                    var member = Blaze.getData(ui.draggable.get(0)),
                        card = Blaze.getData(this);

                    // insert Member
                    CardMembers.insert({
                        memberId: member._id,
                        boardId: member.boardId,
                        cardId: card._id
                    });
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
