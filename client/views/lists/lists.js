Template.addlistForm.helpers({});
Template.addlistForm.events({
    'click .js-open-add-list': function(event, t) {
        t.$('.list').removeClass('idle');
        t.$('.list-name-input').focus();
    },
    'click .js-cancel-edit': function(event, t) {
        t.$('.list').addClass('idle');
    },
    'submit #AddListForm': function(event, t) {
        var title = t.find('.list-name-input');
        if ($.trim(title.value)) {
            // insert 
            Lists.insert({ 
                title: title.value, 
                boardId: this.board._id
            }, function() {

                // insert complete to scrollLeft
                Utils.scrollLeft('#board', 270, true);
            });

            // clear input 
            title.value = '';
        }
        event.preventDefault();
    }
});
