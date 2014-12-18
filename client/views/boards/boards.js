// Template RENDERED and resize board list vs.
Template.board.rendered = function() {
    var window_height = $(window).height();
        resize = function() {
            var board = jQuery(".board-canvas");
            board.height(window_height - 100);
        };

    // initial resize 
    resize();

    // all time resize.
    $(window).resize(resize);
};

Template.boards.helpers({
    boards: function() {
        return Boards.find({});
    }
});

Template.board.helpers({
    board: function() {
        return Boards.findOne({});
    }
});

Template.boards.events({});
Template.board.events({});
