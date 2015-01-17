Router.route('/boards', {
    name: 'Boards',
    template: 'boards',
    bodyClass: 'page-index large-window tabbed-page',
    authenticated: 'Login',
    waitOn: function() {
        return Meteor.subscribe('boards');
    }
});

Router.route('/boards/:boardId/:slug', {
    name: 'Board',
    template: 'board',
    bodyClass: 'page-index chrome chrome-39 mac extra-large-window body-webkit-scrollbars body-board-view bgBoard',
    onAfterAction: function() {
        Session.set('sidebarIsOpen', true);
        Session.set('currentWidget', 'home');
        Session.set('menuWidgetIsOpen', false);
    },
    waitOn: function() {
        var params = this.params;

        return [

            // Update currentUser profile status
            Meteor.subscribe('connectUser'),

            // Board page list, cards members vs
            Meteor.subscribe('board', params.boardId, params.slug)
        ]
    },
    data: function() {
        return Boards.findOne(this.params.boardId);
    }
});
