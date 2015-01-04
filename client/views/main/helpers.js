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
    openWidgets: function() {
        return Session.get('widgets');
    }
};

Template.warning.helpers({
    warning: function() {
        return Utils.Warning.get();
    }
});

Template.pop.helpers({
    pop: function() {
        return Session.get('pop');
    }
});

// Register all Helpers
_.each(Helpers, function(fn, name) { Blaze.registerHelper(name, fn); });
