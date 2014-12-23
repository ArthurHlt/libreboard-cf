(function() {
    var root = this;

    root.allowCardMembers = function(userId, doc) {
        var member = CardMembers.findOne(_.pick(doc, ['userId', 'cardId', 'boardId']));
        return userId && !member;
    };

    root.allowMemberTypeAdmin = function(userId, boardId) {
        return BoardMembers.findOne({ userId: userId, boardId: boardId, memberType: 'admin' });
    };

    root.allowBoardMembers = function(userId, boardId, options) {
        var filter = _.extend({ userId: userId, boardId: boardId }, (options || {}));
        return !!BoardMembers.findOne(filter);
    };

}).call(this);
