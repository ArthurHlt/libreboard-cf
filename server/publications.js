Meteor.publishComposite('profile', function(username) {
    return {
        find: function() {
            return Users.find({ username: username });
        }
    }
});

Meteor.publishComposite('boards', function() {
    return {
        find: function() {
            return Boards.find({ userId: this.userId, closed: false });
        }
    }
});

Meteor.publishComposite('board', function(boardId) {
    return {
        find: function() {
            var boards = Boards.find({ _id: boardId, userId: this.userId, closed: false });

            // currentUser Private or Public board
            if (boards.count()) return boards;

            // Public board
            return Boards.find({ _id: boardId, permission: 'Public', closed: false });
        },
        children: [

            // Lists and Cards
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
            },
            
            // Members
            {
                find: function(board) {
                    return BoardMembers.find({ boardId: board._id });
                },
                children: [
                    // Member Users
                    {
                        find: function(member, board) {
                            return Users.find({ _id: member.userId });
                        } 
                    }    
                ]
            }
        ]
    }
});
