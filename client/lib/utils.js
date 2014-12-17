Utils = {
    error: function(err) {
        Session.set("error", (err && err.message || false));       
    }
};
