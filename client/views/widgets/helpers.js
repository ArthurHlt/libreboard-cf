Template.addMemberPop.helpers({
    member: function(userId, klass) {
        return BoardMembers.findOne({ userId: userId}) ? klass : '';        
    }
});
