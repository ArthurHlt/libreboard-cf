Utils = {
    error: function(err) {
        Session.set("error", (err && err.message || false));       
    },

    // scroll
    Scroll: function(selector) {
        var $el = $(selector);
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
    },

    // Pop
    Pop: {
        Offsets: {
            headerUser: function(offset) {
                return {
                    left: (offset.left - 118),
                    top: (offset.top + 40)
                }
            }         
        },
        getOffset: function($el) {
            var $this = $($el),
                offset = this.Offsets[$this.attr('popOffset')]($this.offset());
            return offset;
        },
        open: function(template, label, $el) {
            var offset = this.getOffset($el);
            Session.set('pop', { 
                template: template, 
                label: label,
                left: offset.left, 
                top: offset.top
            });
        },
        close: function() {
            Session.set('pop', false);
        }
    }
};
