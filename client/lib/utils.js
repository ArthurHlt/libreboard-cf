Utils = {
    error: function(err) {
        Session.set("error", (err && err.message || false));       
    },
    /*
    * Utils.scrollLeft("#board", 300) --> set scrollleft
    * Utils.scrollLeft("#board", 300, true) --> ++ scrollLeft  
    */
    scrollLeft: function(selector, px, px2) {
        var $el = $(selector),
            scrollLeft = $el.scrollLeft();
        $el.animate({ scrollLeft: (px2 ? (scrollLeft + px) : px) });
    }
};
