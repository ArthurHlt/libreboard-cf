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

Meteor.publishComposite('board', function(boardId, slug) {
    return {
        find: function() {
            var filter = { _id: boardId, slug: slug, closed: false },
                member = BoardMembers.findOne({ userId: this.userId, boardId: boardId });

            // if user is authenticated then and private public permission return Boards.
            if (member) return Boards.find(filter);

            // Public board if not is authenticated then publish public boards
            return Boards.find(_.extend({ permission: 'Public' }, filter));
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
