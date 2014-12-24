(function() {
    var root = this;

    root.allowAuthenticated = function() {
        return !!Meteor.user();
    };

    root.allowCardMembers = function(userId, doc) {
        var member = CardMembers.findOne(_.pick(doc, ['memberId', 'cardId', 'boardId']));
        return userId && !member;
    };

    root.allowMemberTypeAdmin = function(userId, boardId) {
        return BoardMembers.findOne({ userId: userId, boardId: boardId, memberType: 'admin' });
    };

    root.allowIsBoardMember = function(userId, boardId) {
        return BoardMembers.findOne({ userId: userId, boardId: boardId });
    }
}).call(this);
