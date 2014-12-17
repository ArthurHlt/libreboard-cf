var Helpers = {
    error: function() {
        return Session.get('error');
    },
    toLowerCase: function(text) {
        return text.toLowerCase();
    },
    toUpperCase: function(text) {
        return text.toUpperCase();
    }
};

// Register all Helpers
_.each(Helpers, function(fn, name) { Blaze.registerHelper(name, fn); });
