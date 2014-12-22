Cards  = new Mongo.Collection('cards');


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


// HELPERS
Cards.helpers({
    list: function() {
        return Cards.find({ listId: this.listId });
    },
    board: function() {
        return Boards.findOne(this.boardId);
    }
});


// CARDS BEFORE HOOK
Cards.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.closed = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
});
