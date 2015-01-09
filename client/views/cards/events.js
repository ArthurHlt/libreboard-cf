Template.addCardForm.events({
    'click .js-cancel': function(event, t) {
        var composer = t.$('.card-composer');

        // Keep the old value in memory to display it again next time
        var inputCacheKey = "addCard-" + this.listId;
        var oldValue = composer.find('.js-card-title').val();
        InputsCache.set(inputCacheKey, oldValue);

        // add composer hide class
        composer.addClass('hide');
        composer.find('.js-card-title').val('');

        // remove hide open link class
        $('.js-open-card-composer').removeClass('hide');
    },
    'keydown .js-card-title': function(event, t) {
        var code = event.keyCode;
        // Pressing enter submit the form and add the card
        if (code === 13) { 
            t.$('#AddCardForm').submit();
            event.preventDefault();
        // Pressing escape close the form
        } else if (code === 27) {
            t.$('.js-cancel').click();
            event.preventDefault();
        }
    },
    'submit #AddCardForm': function(event, t) {
        var title = t.$('.js-card-title'),
            list = title.parents('.list'),
            cards = list.find('.card'),
            sort = cards.last().length ? (Blaze.getData(cards.last()[0]).sort +1) : 0;

        // Clear the form in-memory cache
        var inputCacheKey = "addCard-" + this.listId;
        InputsCache.set(inputCacheKey, '');

        // title trim if not empty then
        if ($.trim(title.val())) {
            Cards.insert({
                title: title.val(),
                listId: this.listId,
                boardId: this.board._id,
                sort: sort
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
        event.preventDefault();
        event.stopPropagation();
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
            Cards.update(this.card._id, {
                $set: {
                    title: title
                }
            }, function (err, res) {
                if (!err) $('.editing').removeClass('editing');
            });
        }

        event.preventDefault();
    },
    'submit #WindowDescEdit': function(event, t) {
        Cards.update(this.card._id, {
            $set: {
                description: t.find('#desc').value
            }
        }, function(err) {
            if (!err) $('.editing').removeClass('editing');
        });
        event.preventDefault();
    },
    'click .js-details-edit-members': function(event, t) {
        var board = this.card.board();
        Utils.Pop.open('cardMembersPop', 'Members', event.currentTarget, {
            members: board.members,
            cardId: this.card._id
        });

        event.preventDefault();
    },
    'click .js-details-edit-labels': function(event, t) {
        var board = this.card.board();
        Utils.Pop.open('cardLabelsPop', 'Labels', event.currentTarget, {
            labels: board.labels,
            cardId: this.card._id,
            boardId: board._id
        });

        event.preventDefault();
    }
});

Template.WindowActivityModule.events({
    'click .js-new-comment:not(.focus)': function(event, t) {
        var $this = $(event.currentTarget);
        $this.addClass('focus');
    },
    'submit #CommentForm': function(event, t) {
        var text = t.$('.js-new-comment-input');
        if ($.trim(text.val())) {
            CardComments.insert({
                boardId: this.card.boardId,
                cardId: this.card._id,
                text: text.val()
            });
            text.val('');
            $('.focus').removeClass('focus');
        }
        event.preventDefault();
    }
});

Template.WindowSidebarModule.events({
    'click .js-change-card-members': function(event, t) {
        var board = this.card.board();
        Utils.Pop.open('cardMembersPop', 'Members', event.currentTarget, {
            members: board.members,
            cardId: this.card._id
        });

        event.preventDefault();
    },
    'click .js-edit-labels': function(event, t) {
        var board = this.card.board();
        Utils.Pop.open('cardLabelsPop', 'Labels', event.currentTarget, {
            labels: board.labels,
            cardId: this.card._id,
            boardId: board._id
        });

        event.preventDefault();
    },
    'click .js-archive-card': function(event, t) {
        // Update
        Cards.update(this.card._id, {
            $set: {
                archived: true
            }
        });
        event.preventDefault();
    },
    'click .js-unarchive-card': function(event, t) {
        Cards.update(this.card._id, {
            $set: {
                archived: false
            }
        });
        event.preventDefault();
    },
    'click .js-delete-card': function(event, t) {
        Utils.Pop.open('deleteCardPop', 'Delete Card?', event.currentTarget, {
            cardId: this.card._id,
            boardId: this.card.board()._id
        });

        event.preventDefault();
    },
    'click .js-more-menu': function(event, t) {
        Utils.Pop.open('cardMorePop', 'More', event.currentTarget, {
            card: this.card,
            board: this.card.board(),
            rootUrl: this.card.rootUrl()
        });
        event.preventDefault();
    }
});

Template.cardMembersPop.events({
    'click .js-select-member': function(event, tpl) {
        var cardId = Template.parentData(2).data.cardId;
        var memberId = this.userId;
        var operation;
        if (Cards.find({ _id: cardId, members: memberId}).count() === 0)
            operation = '$addToSet';
        else
            operation = '$pull';

        var query = {};
        query[operation] = {
            members: memberId
        };
        Cards.update(cardId, query);
        event.preventDefault();
    }
});

Template.cardLabelsPop.events({
    'click .js-select-label': function(event, tpl) {
        var cardId = Template.parentData(2).data.cardId;
        var labelId = this._id;
        var operation;
        if (Cards.find({ _id: cardId, labelIds: labelId}).count() === 0)
            operation = '$addToSet';
        else
            operation = '$pull';

        var query = {};
        query[operation] = {
            labelIds: labelId
        };
        Cards.update(cardId, query);
        event.preventDefault();
    },
    'click .js-edit-label': function(event, tpl) {
        Utils.Pop.open('editLabelPop', 'Change Label', $('.openPop').get(0), _.extend({ boardId: tpl.data.boardId }, this));
        event.preventDefault();
    }
});

Template.editLabelPop.events({
    'submit .edit-label': function(event, tpl) {
        var name = tpl.find('#labelName').value,
            getLabel = Utils.getLabelIndex(this.boardId, this._id),
            selectLabel = Blaze.getData(tpl.$('.js-palette-select:not(.hide)').get(0)),
            $set = {};

        // set label index
        $set[getLabel.key('name')] = name;

        // set color
        $set[getLabel.key('color')] = selectLabel.color;

        // update
        Boards.update(this.boardId, { $set: $set });

        // return to the previous popup view trigger
        $('.js-edit-labels').trigger('click');

        event.preventDefault();
    },
    'click .js-palette-color': function(event, tpl) {
        var $this = $(event.currentTarget);

        // hide selected ll colors
        $('.js-palette-select').addClass('hide');

        // show select color
        $this.find('.js-palette-select').removeClass('hide');
    }
});

Template.deleteCardPop.events({
    'click .js-confirm': function() {
        Cards.remove(this.cardId);

        // redirect board
        Utils.goBoardId(this.boardId);
    }
});

Template.cardLabelsPop.events({
    'click .js-select-label': function() {
        Cards.remove(this.cardId);

        // redirect board
        Utils.goBoardId(this.boardId);
    }
});

Template.cardMorePop.events({
    'click .js-delete': function(event, t) {
        Utils.Pop.open('deleteCardPop', 'Delete Card?', $('.openPop').get(0), {
            cardId: this.card._id,
            boardId: this.card.boardId
        });
        event.preventDefault();
    }
});
