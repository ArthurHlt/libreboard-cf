Utils = {
    error: function(err) {
        Session.set("error", (err && err.message || false));       
    },

    // scroll
    Scroll: function(selector) {
        var $el = $(selector);

        console.log($el[0]);
        return {
            top: function(px, add) {
                var t = $el.scrollTop();
                $el.animate({ scrollTop: (add ? (t + px) : px) });
            },
            left: function(px, add) {
                var l = $el.scrollLeft();
                $el.animate({ scrollLeft: (add ? (l + px) : px) });
            }
        };
    }
};
