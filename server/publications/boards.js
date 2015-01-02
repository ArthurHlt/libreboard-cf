Meteor.publishComposite('boards', function() {
    return {
        find: function() {
            // Flat id list
            var boardIds = BoardMembers.find({ userId: this.userId, approved: true }).map(function(b) {
                // members [boardId, boardId] flats
                return b.boardId;
            });

            // Board members
            return Boards.find({ _id: { $in: boardIds }, archived: false });
        }
    }
});

Meteor.publishComposite('board', function(boardId, slug) {
    return {
        find: function() {
            var filter = { _id: boardId, slug: slug, archived: false },
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
                    return Lists.find({ boardId: board._id });
                },
                children: [
                    {
                        find: function(list, board) {
                            return Cards.find({ listId: list._id });
                        },

                        // CardMembers
                        children: [
                            {
                                find: function(card) {
                                    return CardMembers.find({ cardId: card._id });
                                }
                            },
                            {
                                find: function(card) {
                                    return CardComments.find({ cardId: card._id });
                                }
                            }
                        ]
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
                            return Users.find({ _id: member.userId }, { fields: { profile: true, username: true }});
                        }
                    }
                ]
            },

            // Activities
            {
                find: function(board) {
                    return Activities.find({ boardId: board._id });
                }
            }
        ]
    }
});
