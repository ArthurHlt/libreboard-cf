/*
*
* To make this available on the client, use a reactive cursor, 
* such as by creating a publication on the server: 
*/
Meteor.publish('connectUser', function() {
    var _this = this,
        user = Users.findOne(_this.userId);
        
    // if user then ready subscribe
    if (user) { 

        // status offline then
        if (user.profile.status == 'offline') {
        
            // User profile.status update online
            Users.update(_this.userId, { $set: { 'profile.status': 'online' }});
        }

        // user close subscribe onStop callback update user.profile.status 'offline'
        _this.onStop(function() {
            
            // update offline user
            Users.update(_this.userId, { $set: { 'profile.status': 'offline' }});
        });
    }

    
    // subscribe ready 
    _this.ready();
});

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
                            return Users.find({ _id: member.userId });
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
