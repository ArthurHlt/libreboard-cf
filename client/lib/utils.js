var Offsets = {
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
    },
    boardRemove: function(offset) {
        return { left: (offset.left - 61), top: (offset.top - 8) }
    },
    membersAdd: function(offset) {
        return { left: (offset.left - 61), top: (offset.top + 35) }
    },
    member: function(offset) {
        var width = $(window).width();
        return { left: (width - 310), top: (offset.top + 35) }
    },
    removeMember: function(offset) {
        var width = $(window).width();
        return { left: (width - 310), top: (offset.top - 103) }
    }
};

Utils = {
    error: function(err) {
        Session.set("error", (err && err.message || false));       
    },

    is_authenticated: function() {
        return Meteor.user() ? true : false;
    },

    resizeHeight: function(selector, callback) {
        return function() {
            var board = jQuery(selector);
            board.height($(window).height() - 100);
            
            // call
            callback && callback();
        }
    },

    widgetsHeight: function() {
        var wrapper = $('.board-wrapper'),
            widgets = $('.board-widgets');
        
        // set height widgets
        widgets.height(wrapper.height());
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
        getOffset: function($el) {
            var $this = $($el),
                offset = Offsets[$this.attr('popOffset')]($this.offset());
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
    },

    Warning: {
        get: function() {
            return Session.get('warning');     
        },
        open: function(desc) {
            Session.set('warning', { desc: desc });
        },
        close: function() {
            Session.set('warning', false);
        }        
    },

    Overlay: {
        get: function() {
            return Session.get('windowOverlay');     
        },
        open: function(opt) {
            // default close window
            this.close();

            // add Class up
            $('body').addClass('window-up');

            // set window
            Session.set('windowOverlay', _.extend({
                template: '',
                data: {}            
            }, opt));
        },
        close: function() {
            $('body').removeClass('window-up');
            Session.set('windowOverlay', false);
        }        
    },

    goBoardId: function(_id) {
        var board = Boards.findOne({ _id: _id });
        return board && Router.go('Board', { _id: board._id, slug: board.slug });
    },

    liveEvent: function(events, callback) {
        $(document).on(events, function() {
            callback($(this));
        });
    },

    // memberType admin $or normal
    isMemberFilter: function(filter) {
        return (this.is_authenticated() && BoardMembers.findOne(filter));
    },

    isMemberAdmin: function(yes, no) {
        var filter = { userId: Meteor.userId(), memberType: 'admin' };
        return this.isMemberFilter(filter) ? yes : no;
    },

    isMemberNormal: function(yes, no) {
        var filter = { userId: Meteor.userId(), memberType: 'normal' };
        return this.isMemberFilter(filter) ? yes : no;
    },

    isMemberAll: function(yes, no) {
        var filter = { 
            $or: [ 
                { userId: Meteor.userId(), memberType: 'admin' },
                { userId: Meteor.userId(), memberType: 'normal' }
            ]
        };
        return this.isMemberFilter(filter) ? yes : no;
    }
};
