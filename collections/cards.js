Cards = new Mongo.Collection('cards');
CardMembers = new Mongo.Collection('card_members');

// ALLOWS
Cards.allow({
    insert: function(userId, doc) { 
        return !!BoardMembers.findOne(_.pick(doc, ['userId', 'boardId']));
    },
    update: function(userId, doc) {
        return !!BoardMembers.findOne(_.pick(doc, ['userId', 'boardId']));
    },
    remove: function(userId, doc) { 
        return !!BoardMembers.findOne(_.pick(doc, ['userId', 'boardId']));
    }
});


CardMembers.allow({
    insert: function(userId, doc) {
        var member = CardMembers.findOne(_.pick(doc, ['userId', 'cardId', 'boardId']));
        return userId && !member;
    }
});

// HELPERS
Cards.helpers({
    list: function() {
        return Cards.find({ listId: this.listId });
    },
    members: function() {
        return CardMembers.find({ cardId: this._id });
    },
    board: function() {
        return Boards.findOne(this.boardId);
    }
});

CardMembers.helpers({
    user: function() {
        return Users.findOne(this.userId); 
    },
    boardMember: function() {
        return BoardMembers.findOne({ userId: this.userId, boardId: this.boardId });
    }
});


// CARDS BEFORE HOOK
Cards.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.closed = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
});


// CARDMEMBERS BEFORE HOOK
CardMembers.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});
