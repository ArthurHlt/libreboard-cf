Meteor.publish('boards', function() {
    return Boards.find({
        'members.userId': this.userId,
        archived: false
    });
});

Meteor.publishComposite('board', function(boardId, slug) {
    check(boardId, String);
    check(slug, String);
    return {
        find: function() {
            var filter = {
                    _id: boardId,
                    slug: slug,
                    archived: false
                },
                board = Boards.findOne(filter);

            if (board) {
                if (board.permission !== 'Public' && ! _.contains(boards.members.keys(), this.userId)) {
                    return new Meteor.Error(404, "Not found");
                }

                // default return boards
                return Boards.find(filter, { limit: 1 });
            }
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

                        children: [
                            // Card members
                            {
                                find: function(card) {
                                    return Users.find({ _id: { $in: card.members || [] }});
                                }
                            },
                            // Card comments
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
                    return Users.find({ _id: { $in: _.pluck(board.members, 'userId') }});
                }
            },

            // Activities
            {
                find: function(board) {
                    return Activities.find({ boardId: board._id });
                },
                children: [
                    // Card members
                    {
                        find: function(activity) {
                            if (activity.memberId)
                                return Users.find(activity.memberId);
                        }
                    }
                ]
            }
        ]
    }
});
