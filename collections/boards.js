Boards = new Mongo.Collection('boards');
BoardMembers = new Mongo.Collection('board_members');

// ALLOWS
Boards.allow({
    insert: function(userId, doc) { return doc.userId === userId; },
    update: function(userId, doc) { return doc.userId === userId; },
    remove: function(userId, doc) { return doc.userId === userId; },
});


BoardMembers.helpers({
    user: function() {
        return Users.findOne({ _id: this.userId });
    }
});

// HELPERS
Boards.helpers({
    lists: function() {
        return Lists.find({ boardId: this._id }, { sort: { sort: 1 }});
    },
    members: function() {
        return BoardMembers.find({});         
    },
    edit: function(yes, no) {
        var member = BoardMembers.findOne({ userId: Meteor.userId() });
        return member ? yes : no ;
    }
});

// BOARDSMEMBERS BEFORE HOOK INSERT
BoardMembers.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
});

// BOARDS BEFORE HOOK INSERT
Boards.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.openWidgets = true;
    doc.closed = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;

    // Members insert admin
    if (doc._id) {
        BoardMembers.insert({
            boardId: doc._id,
            userId: doc.userId,
            memberType: "admin"
        });
    }
});


// BOARDS BEFORE HOOK UPDATE
Boards.before.update(function(userId, doc, fieldNames, modifier) {
    modifier.$set.modifiedAt = new Date();
});
