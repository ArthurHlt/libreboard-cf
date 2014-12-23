Template.search.helpers({ });

Template.warning.helpers({
    warning: function() {
        return Utils.Warning.get();          
    }
});

Template.pop.helpers({
    pop: function() {
        return Session.get('pop');
    }        
});


Template.search.events({ });

Template.pop.events({
    'click .js-close-popover': function() {
        Utils.Pop.close();
    }
});
