Router.route('/boards', {
    name: 'Boards',
    template: 'boards',
    layoutTemplate: 'AuthLayout',
    bodyClass: 'page-index large-window tabbed-page',
    waitOn: function() {
        return Meteor.subscribe('boards');
    }
});

Router.route('/boards/:_id', {
    name: 'Board',
    template: 'board',
    layoutTemplate: 'AuthLayout',
    bodyClass: 'page-index body-webkit-scrollbars body-board-view bgBoard',
    waitOn: function() {
        return Meteor.subscribe('board', this.params._id);
    },
    data: function() {
        return {
            perm: function(klass) {
                return !Meteor.user() ? klass : '';
            }
        }      
    }
});
