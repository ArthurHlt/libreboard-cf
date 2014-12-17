Router.route('/boards', {
    name: 'Boards',
    template: 'boards',
    layoutTemplate: 'AuthLayout',
    waitOn: function() {
        return Meteor.subscribe('boards');
    }
});

Router.route('/boards/:_id', {
    name: 'Board',
    template: 'board',
    layoutTemplate: 'AuthLayout',
    waitOn: function() {
        return Meteor.subscribe('board', this.params._id);
    }
});
