// Sandstorm context is detected using the METEOR_SETTINGS environment variable
// in the package definition.
// XXX We could probably rely on the user object to detect sandstorm usage.
var isSandstorm = Meteor.settings &&
                  Meteor.settings.public && Meteor.settings.public.sandstorm;

// In sandstorm we only have one board per sandstorm instance. Since we want to
// keep most of our code unchanged, we simply hard-code a board `_id` and
// redirect the user to this particular board.
var sandstormBoard = {
    _id: "sandstorm",
    title: "LibreBoard"
};

// On the first launch of the instance a user is automatically created thanks to
// the `accounts-sandstorm` package. After its creation we insert the unique
// board document.
if (isSandstorm && Meteor.isServer) {
    Users.after.insert(function(userId, doc) {
        Boards.insert({
            _id: sandstormBoard._id,
            // XXX should be shared with the instance name
            title: sandstormBoard.title,
            userId: doc._id
        });
    });
}

// On the client, redirect the user to the hard-coded board. On the first launch
// the user will be redirected to the board before its creation. But that's not
// a problem thanks to the reactive board publication.
if (isSandstorm && Meteor.isClient) {
    Router.go('Board', {
        boardId: sandstormBoard._id,
        slug: getSlug(sandstormBoard.title)
    });
}

// We use this blaze helper in the UI to hide some template that does not make
// sense in the context of sandstorm, like board staring, board archiving, user
// name edition, etc.
Blaze.registerHelper("isSandstorm", function() {
    return isSandstorm;
});
