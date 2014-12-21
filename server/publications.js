Meteor.publishComposite('boards', function() {
    return {
        find: function() {
            return Boards.find({ userId: this.userId });
        }
    }
});

Meteor.publishComposite('board', function(boardId) {
    return {
        find: function() {
            var boards = Boards.find({ _id: boardId, userId: this.userId });

            // currentUser Private or Public board
            if (boards.count()) return boards;

            // Public board
            return Boards.find({ _id: boardId, permission: 'Public' });
        },
        children: [
            {
                find: function(board) {
                    return Lists.find({ boardId: board._id, closed: false });
                },
                children: [
                    {
                        find: function(list, board) {
                            return Cards.find({ listId: list._id, closed: false });
                        }
                    }
                ]
            }
        ]
    }
});
