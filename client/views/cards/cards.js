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

Template.addCardForm.helpers({});

Template.addCardForm.events({
    'click .js-cancel': function(event, t) {
        var composer = t.$('.card-composer');

        // add composer hide class
        composer.addClass('hide');
        composer.find('.js-card-title').val('');

        // remove hide open link class
        $('.js-open-card-composer').removeClass('hide');
    },
    'keypress .js-card-title': function(event, t) {
        if (event.charCode == 13) { 
            t.$('#AddCardForm').submit();
            event.preventDefault();
        }
    },
    'submit #AddCardForm': function(event, t) {
        var title = t.$('.js-card-title'),
            list = title.parents('.list');
            
        // title trim if not empty then
        if ($.trim(title.val())) {
            Cards.insert({ 
                title: title.val(),
                listId: this.listId,
                boardId: this.board._id,
                sort: list.find('.list-card').length
            });

            // empty and focus.
            title.val('').focus();

            // focus complete then scroll top
            Utils.Scroll(list.find('.list-cards')).top(1000, true);
        }
        event.preventDefault();
    }
});

Template.cards.events({
    'click .member': function(event, t) {
        Utils.Pop.open('cardMemberPop', false, event.currentTarget, {
            member: this,
            user: this.member().user(),
        });
    }
});

Template.cardMemberPop.events({
    'click .js-remove-member': function(event, t) {

        // remove member 
        CardMembers.remove(this.member._id);

        // close pop
        Utils.Pop.close();
    }
});
