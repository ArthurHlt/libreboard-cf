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
            return Boards.find({ _id: boardId });
        },
        children: [
            {
                find: function(board) {
                    return Lists.find({ boardId: board._id });
                },
                children: [
                    {
                        find: function(list, board) {
                            return Cards.find({ listId: list._id });
                        }
                    }
                ]
            }
        ]
    }
});
