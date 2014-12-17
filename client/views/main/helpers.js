var Helpers = {
    // helpers 
};


// Register all Helpers
_.each(Helpers, function(fn, name) { Blaze.registerHelper(name, fn); });
