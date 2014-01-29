if (Meteor.isClient) {

    // gravatar get image
    Handlebars.registerHelper('gravatar', function(user, size) {
        var slash = MD5(user.profile.gravatar) + '.jpg?s=' + size || 80;
        return 'http://www.gravatar.com/avatar/' + slash;
    });

    Handlebars.registerHelper('activePage', function(page) {
        return Meteor.Router.page() == page ? "active" : "";
    });
}
