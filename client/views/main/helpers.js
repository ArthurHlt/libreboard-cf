// By default we open the widgets sidebar
// XXX Should we persiste user preference somewhere? In the server database? In
// the browser?
Session.setDefault('sidebarIsOpen', true);

var Helpers = {
    error: function() {
        return Session.get('error');
    },
    toLowerCase: function(text) {
        return text && text.toLowerCase();
    },
    toUpperCase: function(text) {
        return text && text.toUpperCase();
    },
    firstChar: function(text) {
        return text && text[0].toUpperCase();
    },
    session: function(prop) {
        return Session.get(prop);
    },
    isTrue: function(a, b) {
        return a == b;
    },
    isTrueThen: function(a, b, trueThen, falseThen) {
        return a == b ? trueThen : (falseThen || false);
    },
    moment: function(d, f) {
        return moment(d).format(f);
    }
};

Template.warning.helpers({
    warning: function() {
        return Utils.Warning.get();
    }
});

// Register all Helpers
_.each(Helpers, function(fn, name) { Blaze.registerHelper(name, fn); });

// XXX I believe we should compute a HTML rendered field on the server that
// would handle markdown, emojies and user mentions. We can simply have two
// fields, one source, and one compiled version (in HTML) and send only the
// compiled version to most users -- who don't need to edit.
// In the meantime, all the transformation are done on the client using the
// Blaze API.
var at = HTML.CharRef({html: '&commat;', str: '@'});
Blaze.Template.registerHelper('mentions', new Template('mentions', function() {
    var view = this;
    var content = Blaze.toHTML(view.templateContentBlock);
    var currentBoard = Boards.findOne(Router.current().params.boardId);
    var knowedUsers = _.map(currentBoard.members, function(member) {
        member.username = Users.findOne(member.userId).username;
        return member;
    });

    var mentionRegex = /\B@(\w*)/gi;
    var currentMention, knowedUser, href, linkClass, linkValue, link;
    debugger;
    while (currentMention = mentionRegex.exec(content)) {

        knowedUser = _.findWhere(knowedUsers, { username: currentMention[1] });
        if (! knowedUser)
            continue;

        linkValue = [' ', at, knowedUser.username];
        href = Router.url('Profile', { username: knowedUser.username });
        linkClass = 'atMention' + (knowedUser.userId === Meteor.userId() ? ' me' : '');
        link = HTML.A({ href: href, "class": linkClass }, linkValue);

        content = content.replace(currentMention[0], Blaze.toHTML(link));
    }

    return HTML.Raw(content);
}));