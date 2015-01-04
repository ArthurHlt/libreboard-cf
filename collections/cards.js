Cards = new Mongo.Collection('cards');
CardComments = new Mongo.Collection('card_comments');

// ALLOWS
Cards.allow({
    insert: function(userId, doc) {
        return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    update: function(userId, doc) {
        return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    remove: function(userId, doc) {
        return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    fetch: ['boardId']
});

CardComments.allow({
    insert: function(userId, doc) {
        return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    update: function(userId, doc) {
        return userId === doc.userId;
    },
    remove: function(userId, doc) {
        return userId === doc.userId;
    },
    fetch: ['userId, boardId']
});


// HELPERS
Cards.helpers({
    list: function() {
        return Lists.findOne(this.listId);
    },
    oldList: function() {
        return Lists.findOne(this.oldListId);
    },
    board: function() {
        return Boards.findOne(this.boardId);
    },
    labels: function() {
        var self = this;
        var boardLabels = self.board().labels;
        var cardLabels = _.filter(boardLabels, function(label) {
            return _.contains(self.labelIds, label._id);
        });
        return cardLabels;
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

CardComments.helpers({
    user: function() {
        return Users.findOne(this.userId);
    }
});

// CARDS BEFORE HOOK
CardComments.hookOptions.after.update = { fetchPrevious: false };
Cards.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.dateLastActivity = new Date();

    // defaults
    doc.archived = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
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

    // New activity for card (un)archivage
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
    });

    // New activity for card moves
    Cards.after.update(function(userId, doc, fieldNames, modifier) {
        if (_.contains(fieldNames, "listId") && doc.listId !== doc.oldListId) {
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

    // Add a new activity if we add or remove a member to the card
    Cards.after.update(function(userId, doc, fieldNames, modifier) {
        if (! _.contains(fieldNames, 'members'))
            return;

        // Say hello to the new member
        if (modifier.$addToSet && modifier.$addToSet.members) {
            var memberId = modifier.$addToSet.members;
            Activities.insert({
                type: 'card',
                activityType: "joinMember",
                boardId: doc.boardId,
                cardId: doc._id,
                userId: userId,
                memberId: memberId
            });
        }

        // Say goodbye to the former member
        if (modifier.$pull && modifier.$pull.members) {
            var memberId = modifier.$pull.members.userId;
            Activities.insert({
                type: 'card',
                activityType: "unjoinMember",
                boardId: doc.boardId,
                cardId: doc._id,
                userId: userId,
                memberId: memberId
            });
        }
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
