Template.addMemberPop.helpers({
    member: function(userId, klass) {
        return BoardMembers.findOne({ userId: userId}) ? klass : '';        
    }
});

Template.boardWidgets.events({
    'click .js-show-sidebar': function(event, t) {
        Boards.update(this.board._id, {
            $set: {
                openWidgets: true
            }
        });
    },
    'click .js-hide-sidebar': function() {
        Boards.update(this.board._id, {
            $set: {
                openWidgets: false
            }
        });
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
                closed: true
            }
        }, function(err) {
            // go boards Page 
            if (!err) Router.go('Boards');
        });
    }
});

Template.membersWidget.events({
    'click .js-open-manage-board-members': function(event, t) {
        Utils.Pop.open('addMemberPop', 'Members', event.currentTarget, Boards.findOne());
        event.preventDefault();
    },
    'click .member': function(event, t) {
        Utils.Pop.open('memberPop', false, event.currentTarget, { 
            memberType: this.memberType,
            user: this.user()
        });
    }
});

Template.addMemberPop.events({
    'click .pop-over-member-list li:not(.disabled)': function(event, t) {
        BoardMembers.insert({
            boardId: t.data._id,
            userId: this._id,
            memberType: 'normal'
        }, function(err, memberId) {
            Utils.Pop.close();
        });
    }
});
