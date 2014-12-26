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
    'click .list-card:not(.js-composer)': function(event, t) {
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
        $('.editing').removeClass('editing');
        editable.addClass('editing');
        editable.find('#title').focus();
    },
    'click .js-edit-desc': function(event, t) {
        var editable = t.$('.card-detail-item'); 

        // editing remove based and add current editing.
        $('.editing').removeClass('editing');
        editable.addClass('editing');
        editable.find('#desc').focus();

        event.preventDefault();
    },
    'click .js-cancel-edit': function(event, t) {
        // remove editing hide.
        $('.editing').removeClass('editing');
    },
    'submit #WindowTitleEdit': function(event, t) {
        var title = t.find('#title').value;
        if ($.trim(title)) {
            Cards.update(this.cardId, {
                $set: {
                    title: title
                }
            }, function(err) {
                // close editing
                if (!err) $('.editing').removeClass('editing');
            });
        }

        event.preventDefault();
    },
    'submit #WindowDescEdit': function(event, t) {
        Cards.update(this.cardId, { 
            $set: {
                description: t.find('#desc').value
            }
        }, function(err) {
            if (!err) $('.editing').removeClass('editing');
        });
        event.preventDefault();
    }
});

Template.WindowActivityModule.events({
    'click .js-new-comment:not(.focus)': function(event, t) {
        var $this = $(event.currentTarget);
        $this.addClass('focus');
    },
    'click .js-show-mem-menu': function(event, t) {
        Utils.Pop.open('userPop', false, event.currentTarget, { 
            user: this.card.user()
        });
        event.preventDefault();  
    }
});

Template.WindowSidebarModule.events({
    'click .js-archive-card': function(event, t) {
        Cards.update(this.card._id, { 
            $set: {
                archived: true
            }
        }, function(err) {
        
            // close overlay
            Utils.Overlay.close();
        });

        event.preventDefault();
    }
});
