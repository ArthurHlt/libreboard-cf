Template.boardWidgets.events({
    'click .js-show-sidebar': function(event, t) {
        Session.set('widgets', true);
    },
    'click .js-hide-sidebar': function() {
        Session.set('widgets', false);
    }
});

Template.menuWidget.events({
    'click .js-close-board': Popup.afterConfirm('closeBoard', function() {
        Boards.update(this.board._id, {
            $set: {
                archived: true
            }
        });

        Router.go('Boards');
    }),
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

var getMemberIndex = function(board, searchId) {
    for (var i = 0; i < board.members.length; i++) {
        if (board.members[i].userId === searchId)
            return i;
    }
    throw new Meteor.Error("Member not found");
}

Template.memberPopup.events({
    'click .js-change-role': function(event, t) {
        var currentBoard = Boards.findOne();
        var memberIndex = getMemberIndex(currentBoard, this.memberId);
        var isAdmin = currentBoard.members[memberIndex].isAdmin;
        var setQuery = {};
        setQuery[['members', memberIndex, 'isAdmin'].join('.')] = !isAdmin;
        Boards.update(currentBoard._id, { $set: setQuery });
    },
    'click .js-remove-member:not(.disabled)': Popup.afterConfirm('removeMember', function(){
        var currentBoard = Boards.findOne(Router.current().params.boardId);
        Boards.update(currentBoard._id, {$pull: {members: {userId: this.memberId}}});
        Popup.close();
    }),
    'click .js-leave-member': function(event, t) {
        // @TODO

        Popup.close();
    }
});

Template.membersWidget.events({
    'click .js-open-manage-board-members': Popup.open('addMember'),
    'click .member': Popup.open('member')
});

Template.addMemberPopup.events({
    'click .pop-over-member-list li:not(.disabled)': function(event, t) {
        var userId = this._id;
        var boardId = t.data.board._id;
        Boards.update(boardId, {
            $push: {
                members: {
                    userId: userId,
                    isAdmin: false
                }
            }
        });

        Popup.close();
    }
});
