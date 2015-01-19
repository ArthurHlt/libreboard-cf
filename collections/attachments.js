Attachments = new FS.Collection("attachments", {
    stores: [
        // XXX Add a new store for cover thumbnails so we don't load big images
        // in the general board view
        new FS.Store.GridFS("attachments")
    ]
});

Attachments.allow({
    insert: function(userId, doc) {
        return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    update: function(userId, doc) {
        return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    remove: function(userId, doc) {
        return allowIsBoardMember(userId, Boards.findOne(doc.boardId));
    },
    // We authorize the attachment download either:
    // - if the board is public, everyone (even unconnected) can download it
    // - if the board is private, only board members can download it
    //
    // XXX We have a bug with the userId verification:
    //
    //   https://github.com/CollectionFS/Meteor-CollectionFS/issues/449
    //
    download: function(userId, doc) {
        var query = {
            $or: [
                { 'members.userId': userId },
                { permission: 'Public' }
            ]
        };
        return !!Boards.findOne(doc.boardId, query);
    },
    fetch: ['boardId']
});

// XXX Enforce a schema for the Attachments CollectionFS

Attachments.files.before.insert(function(userId, doc) {
    var file = new FS.File(doc);
    doc.userId = userId;

    if (file.isImage()) {
        doc.cover = true;
    }
});

isServer(function() {
    Attachments.files.after.insert(function(userId, doc) {
        Activities.insert({
            type: 'card',
            activityType: "addAttachment",
            attachmentId: doc._id,
            boardId: doc.boardId,
            cardId: doc.cardId,
            userId: userId
        });
    });
});
