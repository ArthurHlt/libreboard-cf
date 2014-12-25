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
    },
    'click .list-card': function(event, t) {
        Utils.Overlay.open({ template: 'cardDetailWindow', data: {
            cardId: this._id
        }})
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

Template.cardDetailWindow.events({
    'click .editable .js-card-title': function(event, t) {
        var editable = t.$('.card-detail-title');

        // add class editing and focus 
        editable.addClass('editing');
        editable.find('textarea').focus();
    },
    'click .js-cancel-edit': function(event, t) {
        var editable = t.$('.card-detail-title'); 

        // remove editing hide.
        editable.removeClass('editing');
    },
    'submit #WindowTitleEdit': function(event, t) {
        var title = t.find('textarea').value;
        if ($.trim(title)) {
            Cards.update(this.cardId, {
                $set: {
                    title: title
                }
            }, function(err) {
                // close editing
                if (!err) $('.card-detail-title').removeClass('editing');
            });
        }
        event.preventDefault();
    }
});
