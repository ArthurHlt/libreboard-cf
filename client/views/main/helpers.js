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
    isTrue: function(a, b, consl) {
        // Template tag {{# if isTrue a b consl }}
        if (_.isBoolean(consl)) console.log(a, b, a==b);
        return a == b;
    },
    isTrueThen: function(a, b, then) {
        return a == b ? then : false;
    },
    isMemberAdmin: function(yesKlass, noKlass) {
        return Utils.isMemberAdmin(yesKlass, noKlass);
    },
    isMemberNormal: function(yesKlass, noKlass) {
        return Utils.isMemberNormal(yesKlass, noKlass);
    },
    isMemberAll: function(yesKlass, noKlass) {
        return Utils.isMemberAll(yesKlass, noKlass);
    }
};

// Register all Helpers
_.each(Helpers, function(fn, name) { Blaze.registerHelper(name, fn); });
