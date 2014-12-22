Utils = {
    error: function(err) {
        Session.set("error", (err && err.message || false));       
    },

    resizeHeight: function(selector, callback) {
        return function() {
            var board = jQuery(selector);
            board.height($(window).height() - 100);
            
            // call
            callback && callback();
        }
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
                return { left: (offset.left - 118), top: (offset.top + 40) }
            },
            list: function(offset) {
                return { left: (offset.left + 230), top: (offset.top + 25) }
            },
            boardName: function(offset) {
                return { left: (offset.left), top: (offset.top + 35) }
            },
            boardPermission: function(offset) {
                return this.boardName(offset);
            }
        },
        getOffset: function($el) {
            var $this = $($el),
                offset = this.Offsets[$this.attr('popOffset')]($this.offset());
            return offset;
        },
        open: function(template, label, $el, data) {
            var offset = this.getOffset($el);
            Session.set('pop', { 
                template: template, 
                label: label,
                left: offset.left, 
                top: offset.top,
                data: data || {}
            });
        },
        close: function() {
            Session.set('pop', false);
        }
    }
};
