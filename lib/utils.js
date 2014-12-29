(function() {
    var root = this;

    root.allowAuthenticated = function() {
        return !!Meteor.user();
    };

    root.allowCardMembers = function(userId, doc) {
        return userId && !CardMembers.findOne(_.pick(doc, ['memberId', 'cardId', 'boardId']));
    };

    root.allowMemberTypeAdmin = function(userId, boardId) {
        return BoardMembers.findOne({ userId: userId, boardId: boardId, memberType: 'admin', approved: true });
    };

    root.allowIsBoardMember = function(userId, boardId) {
        return BoardMembers.findOne({ userId: userId, boardId: boardId, approved: true });
    };

    root.isServer = function(callback) {
        return Meteor.isServer && callback();
    };
}).call(this);
