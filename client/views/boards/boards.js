Template.board.rendered = function() {

    // update height add, update, remove resize board height.
    Boards.find().observe({
        added: Utils.resizeHeight('.board-canvas', Utils.widgetsHeight),
        updated: Utils.resizeHeight('.board-canvas'),
        removed: Utils.resizeHeight('.board-canvas')
    });

    // resize not update observe changed.
    jQuery(window).resize(Utils.resizeHeight('.board-canvas', Utils.widgetsHeight));
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

Template.changePermissionBoardPop.helpers({
    check: function(perm) {
        return this.permission == perm;
    } 
});

Template.boards.events({});

Template.board.events({
    'click .js-rename-board:not(.no-edit)': function(event, t) {
        Utils.Pop.open('changeBoardTitlePop', 'Rename Board', event.currentTarget, Boards.findOne());
    },
    'click #permission-level:not(.no-edit)': function(event, t) {
        Utils.Pop.open('changePermissionBoardPop', 'Change Visibility', event.currentTarget, Boards.findOne());
    }
});

Template.createBoardPop.events({
    'submit #CreateBoardForm': function(event, t) {
        var title = t.$('#boardNewTitle');

        // trim value title 
        if ($.trim(title.val())) {
            // İnsert Board title
            var boardId = Boards.insert({ title: title.val(), permission : 'Public' });

            // Go to Board _id
            Utils.goBoardId(boardId);
        }
        event.preventDefault();    
    }
});

Template.changeBoardTitlePop.events({
    'submit #ChangeBoardTitleForm': function(event, t) {
        var title = t.$('.js-board-name');
        if ($.trim(title.val())) {
            Boards.update(this._id, { 
                $set: {
                    title: title.val()     
                }
            });

            // pop close 
            Utils.Pop.close();
        }
        event.preventDefault();
    }
});

Template.changePermissionBoardPop.events({
    'click .js-select': function(event, t) {
        var $this = $(event.currentTarget),
            permission = $this.attr('name');

        // update permission
        Boards.update(this._id, { 
            $set: {
                permission: permission
            } 
        });

        // pop close 
        Utils.Pop.close();
    }
});
