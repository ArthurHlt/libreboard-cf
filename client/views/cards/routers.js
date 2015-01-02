Router.route('/boards/:boardId/:slug/:cardId', {
    name: 'Card',
    template: 'card',
    bodyClass: 'page-index chrome chrome-39 mac extra-large-window body-webkit-scrollbars body-board-view bgBoard window-up',
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
        var params = this.params;
        return {
            card: function() {
                return Cards.findOne(params.cardId);
            },
            board: function() {
                return Boards.findOne(params.boardId);
            }
        }
    }
});
