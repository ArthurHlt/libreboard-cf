Utils = {
    error: function() {
        Session.set("error", (err && err.message || false));       
    }
};
