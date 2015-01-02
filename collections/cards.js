Cards = new Mongo.Collection('cards');
CardMembers = new Mongo.Collection('card_members');
CardComments = new Mongo.Collection('card_comments');

// ALLOWS
Cards.allow({
    insert: function(userId, doc) {
        return allowIsBoardMember(userId, doc.boardId);
    },
    update: function(userId, doc) {
        return allowIsBoardMember(userId, doc.boardId);
    },
    remove: function(userId, doc) {
        return allowIsBoardMember(userId, doc.boardId);
    }
});

CardComments.allow({
    insert: function(userId, doc) {
        return allowIsBoardMember(userId, doc.boardId);
    },
    update: function(userId, doc) {
        return userId === doc.userId;
    },
    remove: function(userId, doc) {
        return userId === doc.userId;
    }
});

CardMembers.allow({
    insert: function(userId, doc) {
        return allowCardMembers(userId, doc);
    },
    remove: function(userId, doc) {
        return allowIsBoardMember(userId, doc.boardId);
    }
});


// HELPERS
Cards.helpers({
    list: function() {
        return Lists.findOne(this.listId);
    },
    oldList: function() {
        return Lists.findOne(this.oldListId);
    },
    members: function() {
        return CardMembers.find({ cardId: this._id });
    },
    board: function() {
        return Boards.findOne(this.boardId);
    },
    user: function() {
        return Users.findOne(this.userId);
    },
    activities: function() {
        return Activities.find({ type: 'card', cardId: this._id }, { sort: { createdAt: -1 }});
    },
    comments: function() {
        return CardComments.find({ cardId: this._id }, { sort: { createdAt: -1 }});
    },
    absoluteUrl: function() {
        var board = this.board();
        return Router.path("Card", { boardId: board._id, slug: board.slug, cardId: this._id });
    }
});

CardMembers.helpers({
    member: function() {
        return BoardMembers.findOne(this.memberId);
    }
});

CardComments.helpers({
    user: function() {
        return Users.findOne(this.userId);
    }
});

// CARDS BEFORE HOOK
Cards.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.dateLastActivity = new Date();

    // defaults
    doc.archived = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
});


// CARDMEMBERS BEFORE HOOK
CardMembers.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});


CardComments.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.userId = userId;
});

isServer(function() {
    Cards.after.insert(function(userId, doc) {
        Activities.insert({
            type: 'card',
            activityType: "createCard",
            boardId: doc.boardId,
            listId: doc.listId,
            cardId: doc._id,
            userId: userId
        });
    });

    Cards.after.update(function(userId, doc, fieldNames, modifier) {
        if (_.contains(fieldNames, 'archived')) {
            if (doc.archived) {
                Activities.insert({
                    type: 'card',
                    activityType: "archivedCard",
                    boardId: doc.boardId,
                    listId: doc.listId,
                    cardId: doc._id,
                    userId: userId
                });
            } else {
                Activities.insert({
                    type: 'card',
                    activityType: "restoredCard",
                    boardId: doc.boardId,
                    listId: doc.listId,
                    cardId: doc._id,
                    userId: userId
                });
            }
        }

        // card move to other list
        if (doc.listId != doc.oldListId) {
            Activities.insert({
                type: 'card',
                activityType: "moveCard",
                listId: doc.listId,
                oldListId: doc.oldListId,
                boardId: doc.boardId,
                cardId: doc._id,
                userId: userId
            });
        }
    });

    CardMembers.after.insert(function(userId, doc) {
        Activities.insert({
            type: 'card',
            activityType: "joinMember",
            memberId: doc.memberId,
            boardId: doc.boardId,
            cardId: doc.cardId,
            userId: userId
        });
    });

    CardComments.after.insert(function(userId, doc) {
        Activities.insert({
            type: 'comment',
            activityType: "addComment",
            boardId: doc.boardId,
            cardId: doc.cardId,
            commentId: doc._id,
            userId: userId
        });
    });

    CardComments.after.remove(function(userId, doc) {
        var activity = Activities.findOne({ commentId: doc._id });
        if (activity) {
            Activities.remove(activity._id);
        }
    });
});
