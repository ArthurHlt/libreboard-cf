// This is the publication used to display the board list. We publish all the
// non-archived boards:
// 1. that the user is a member of
// 2. the user has starred
Meteor.publish('boards', function() {
    // Ensure that the user is connected
    check(this.userId, String);

    // Defensive programming to verify that starredBoards has the expected
    // format -- since the field is in the `profile` a user can modify it.
    var starredBoards = Users.findOne(this.userId).profile.starredBoards || [];
    check(starredBoards, [String]);

    return Boards.find({
        archived: false,
        $or: [
            { 'members.userId': this.userId },
            { _id: { $in: starredBoards } }
        ]
    }, {
        fields: {
            _id: 1,
            slug: 1,
            title: 1
        }
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

            if (board && _.findWhere(board.members, { userId: this.userId })) {
                return Boards.find(filter, { limit: 1 });
            }

            // permission
            filter.permission = 'Public';

            // default return boards
            return Boards.find(filter, { limit: 1 });
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
