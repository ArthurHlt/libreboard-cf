Router.route('/boards', {
    name: 'Boards',
    template: 'boards',
    bodyClass: 'page-index large-window tabbed-page',
    waitOn: function() {
        return Meteor.subscribe('boards');
    }
});

Router.route('/boards/:_id', {
    name: 'Board',
    template: 'board',
    bodyClass: 'page-index chrome chrome-39 mac extra-large-window body-webkit-scrollbars body-board-view bgBoard',
    waitOn: function() {
        return Meteor.subscribe('board', this.params._id);
    }
});
