Template.boardWidgets.events({
    'click .js-show-sidebar': function(event, t) {
        Session.set('widgets', true);
    },
    'click .js-hide-sidebar': function() {
        Session.set('widgets', false);
    }
});

Template.menuWidget.events({
    'click .js-close-board': function(event, t) {
        Utils.Pop.open('closeBoardPop', 'Close Board?', event.currentTarget, Boards.findOne());
        event.preventDefault();
    },
    'click .js-toggle-widget-nav': function(event, t) {
        var content = $('.board-widgets-content'),
            listWidget = $('.board-widget-nav');

        // toggle short hasClass remove short and collapsed classes
        if (content.hasClass('short')) {
            content.removeClass('short');
            listWidget.removeClass('collapsed');

        // if found then add Class show menu
        } else {
            content.addClass('short');
            listWidget.addClass('collapsed');
        }
    }
});

Template.closeBoardPop.events({
    'click .js-confirm': function(event, t) {
        // update board close
        Boards.update(this._id, {
            $set: {
                archived: true
            }
        }, function(err) {
            // go boards Page 
            if (!err) Router.go('Boards');
        });
    }
});

Template.memberPop.events({
    'click .js-change-role': function(event, t) {},
    'click .js-remove-member:not(.disabled)': function(event, t) {
        Utils.Pop.open('removeMemberPop', 'Remove Member?', event.currentTarget, {
            user: this.user,
            board: Boards.findOne(),
            memberId: this.memberId
        });
    },
    'click .js-leave-member': function(event, t) {
        BoardMembers.update(this.memberId, {
            $set: {
                approved: false 
            }
        });
        
        // pop close
        Utils.Pop.close();
    }
});

Template.membersWidget.events({
    'click .js-open-manage-board-members': function(event, t) {
        Utils.Pop.open('addMemberPop', 'Members', event.currentTarget, Boards.findOne());
        event.preventDefault();
    },
    'click .member': function(event, t) {
        Utils.Pop.open('memberPop', false, event.currentTarget, { 
            memberId: this._id,
            memberType: this.memberType,
            user: this.user()
        });
    }
});

Template.addMemberPop.events({
    'click .pop-over-member-list li:not(.disabled)': function(event, t) {
        var filter = { boardId: t.data._id, userId: this._id, memberType: 'normal' },
            member = BoardMembers.findOne(filter);
        if (member) {
            BoardMembers.update(member._id, { 
                $set: { 
                    approved: true 
                }
            });
        } else {
            BoardMembers.insert(_.extend({
                approved: true
            }, filter));
        }
        Utils.Pop.close();
    }
});

Template.removeMemberPop.events({
    'click .js-confirm': function(event, t) {

        // remove Member
        BoardMembers.update(this.memberId, {
            $set: {
                approved: false 
            }
        });

        // pop close
        Utils.Pop.close();
    }
});
