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
        Boards.update(this._id, {
            $set: {
                archived: true
            }
        });

        // boards page
        Router.go('Boards');

        // prevent default
        event.preventDefault();
    }
});

var getMemberIndex = function(board, searchId) {
    for (var i = 0; i < board.members.length; i++) {
        if (board.members[i].userId === searchId)
            return i;
    }
    throw new Meteor.Error("Member not found");
}

Template.memberPop.events({
    'click .js-change-role': function(event, t) {
        var currentBoard = Boards.findOne();
        var memberIndex = getMemberIndex(currentBoard, this.memberId);
        var isAdmin = currentBoard.members[memberIndex].isAdmin;
        var setQuery = {};
        setQuery[['members', memberIndex, 'isAdmin'].join('.')] = !isAdmin;
        Boards.update(currentBoard._id, { $set: setQuery });
    },
    'click .js-remove-member:not(.disabled)': function(event, t) {
        Utils.Pop.open('removeMemberPop', 'Remove Member?', event.currentTarget, {
            user: this.user,
            board: Boards.findOne(),
            memberId: this.memberId
        });
    },
    'click .js-leave-member': function(event, t) {
        // @TODO

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
        var member = this.member;
        Utils.Pop.open('memberPop', false, event.currentTarget, {
            memberId: this.memberId
        });
    }
});

Template.addMemberPop.events({
    'click .pop-over-member-list li:not(.disabled)': function(event, t) {
        var userId = this._id;
        var boardId = t.data._id;
        Boards.update(boardId, {
            $push: {
                members: {
                    userId: userId,
                    isAdmin: false
                }
            }
        });

        Utils.Pop.close();
    }
});

Template.removeMemberPop.events({
    'click .js-confirm': function(event, t) {
        var currentBoard = Boards.findOne();
        Boards.update(currentBoard._id, {$pull: {members: {userId: this.memberId}}});

        Utils.Pop.close();
    }
});
