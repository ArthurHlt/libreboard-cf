Cards = new Mongo.Collection('cards');
CardMembers = new Mongo.Collection('card_members');

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
    member: function() {
        return BoardMembers.findOne(this.memberId);
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
