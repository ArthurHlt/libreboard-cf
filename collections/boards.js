Boards = new Mongo.Collection('boards');


// ALLOWS
Boards.allow({
    insert: function(userId, doc) { return doc.userId === userId; },
    update: function(userId, doc) { return doc.userId === userId; },
    remove: function(userId, doc) { return doc.userId === userId; },
});


// HELPERS
Boards.helpers({
    lists: function() {
        return Lists.find({ boardId: this._id }, { sort: { sort: 1 }});
    }
});


// BOARDS BEFORE HOOK INSERT
Boards.before.insert(function(userId, doc) {
    doc.createdAt = new Date();
    doc.closed = false;

    // userId native set.
    if (!doc.userId) doc.userId = userId;
});


// BOARDS BEFORE HOOK UPDATE
Boards.before.update(function(userId, doc, fieldNames, modifier) {
    modifier.$set.modifiedAt = new Date();
});
