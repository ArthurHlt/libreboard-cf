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
    bodyClass: 'boardPage',
    waitOn: function() {
        return Meteor.subscribe('board', this.params._id);
    }
});
