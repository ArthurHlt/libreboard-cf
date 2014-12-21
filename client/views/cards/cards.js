Template.cards.rendered = function() {
    var _this = this,
        cards = _this.$(".cards");

    cards.sortable({
        connectWith: ".cards",
        tolerance: 'pointer',
        appendTo: 'body',
        helper: "clone",
        items: '.list-card:not(.js-composer)',
        placeholder: 'list-card placeholder',
        start: function (event, ui) {
            $('.list-card.placeholder').height(ui.item.height());
        },
        update: function(event, ui) {
            var list = ui.item.parents('.list-cards'),
                cards = list.find('.list-card');
            cards.each(function(i, card) {
                Cards.update(Blaze.getData(card)._id, {
                    $set: {
                        sort: i,
                        listId: Blaze.getData(list.get(0)).listId
                    }
                });
            });
        }

    }).disableSelection();
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
