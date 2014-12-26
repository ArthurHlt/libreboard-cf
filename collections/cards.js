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
        return Lists.findOne(this.listId);
    },
    members: function() {
        return CardMembers.find({ cardId: this._id });
    },
    board: function() {
        return Boards.findOne(this.boardId);
    },
    user: function() {
        return Users.findOne(this.userId);
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

    // defaults
    doc.archived = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
});


// CARDMEMBERS BEFORE HOOK
CardMembers.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});
