if (Meteor.isClient) {
    // gravatar get image
    Handlebars.registerHelper('gravatar', function(_id, size) {
        var user = Meteor.users.findOne({_id: _id }),
            slash = "";
        if (user) {
            slash = MD5(user.profile.gravatar) + '.jpg?s=' + size || 80;
        }
        return 'http://www.gravatar.com/avatar/' + slash;
    });

    Handlebars.registerHelper('activePage', function(page) {
        return Meteor.Router.page() == page ? "active" : "";
    });

    Handlebars.registerHelper('get_user', function(userid, req) {
        var user = Meteor.users.findOne({ _id: userid });
        if (user) {
            return eval("user." + req);
        }
        return {};
    });

    Handlebars.registerHelper('get_board', function(board_id, req) {
        var user = Meteor.users.findOne({ _id: userid });
        if (user) {
            return eval("user." + req);
        }
        return {};
    });
}
