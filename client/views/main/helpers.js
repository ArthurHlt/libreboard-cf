var Helpers = {
    error: function() {
        return Session.get('error');
    }
};

// Register all Helpers
_.each(Helpers, function(fn, name) { Blaze.registerHelper(name, fn); });
