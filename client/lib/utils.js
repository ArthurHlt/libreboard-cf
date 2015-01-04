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
    user: function(offset) {
        return { left: (offset.left), top: (offset.top + 20) }
    },
    removeMember: function(offset) {
        var width = $(window).width();
        return { left: (width - 310), top: (offset.top - 103) }
    },
    button: function(offset) {
        return { left: offset.left, top: (offset.top + 40) }
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

    boardScrollLeft: function() {
        var el = jQuery('#board'),
            data = Blaze.getData(el.get(0)),
            sessionName = data.board ? 'scrollBoardLeft-' + data.board._id : false;

        if (sessionName) {
            el.scroll(function() {
                Session.set(sessionName, $(this).scrollLeft());
            });
            el.scrollLeft(Session.get(sessionName));
        }
    },

    widgetsHeight: function() {
        var wrapper = $('.board-wrapper'),
            widgets = $('.board-widgets'),
            boardActions = $('.board-actions-list'),
            pop = $('.pop-over');

        // set height widgets
        widgets.height(wrapper.height());
        boardActions.height(wrapper.height() - 215);
        pop.find('.content').css('max-height', widgets.height() / 2);

        // resize and default pop offset
        if (pop[0]) {
            var popOffset = Utils.Pop.getOffset($('.openPop').get());
            pop.css({ top: popOffset.top, left: popOffset.left });
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

            // openPop
            $($el).addClass('openPop');
        },
        close: function() {
            Session.set('pop', false);
            $('.openPop').removeClass('openPop');
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

    goBoardId: function(_id) {
        var board = Boards.findOne(_id);
        return board && Router.go('Board', { boardId: board._id, slug: board.slug });
    },

    liveEvent: function(events, callback) {
        $(document).on(events, function() {
            callback($(this));
        });
    },

    // new getCardData(cardEl)
    getCardData: function(item) {
        var el = item.get(0),
            card = Blaze.getData(el),
            list = Blaze.getData(item.parents('.list').get(0)),
            before = item.prev('.card').get(0),
            after = item.next('.card').get(0);

        this.listId = list._id;
        this.oldListId = card.listId;
        this.cardId = card._id;
        this.oldSort = card.sort;

        // if before and after undefined then sort 0
        if (!before && !after) {

            // set sort 0
            this.sort = 0;
        } else {

            /*
            *
            * Blaze.getData takes as a parameter an html element
            * and will return the data context that was bound when
            * that html element was rendered!
            */
            if(!before) {

                /*
                * if it was dragged into the first position grab the
                * next element's data context and subtract one from the rank
                */
                this.sort = Blaze.getData(after).sort - 1;
            } else if(!after) {
                /*
                * if it was dragged into the last position grab the
                * previous element's data context and add one to the rank
                */
                this.sort = Blaze.getData(before).sort + 1;
            } else {

                /*
                * else take the average of the two ranks of the previous
                *  and next elements
                */
                this.sort = (Blaze.getData(after).sort + Blaze.getData(before).sort) / 2;
            }
        }
    },
    getLabelIndex: function(boardId, labelId) {
        var board = Boards.findOne(boardId),
            labels = {};
        _.each(board.labels, function(a, b) {
            labels[a._id] = b;
        });
        return {
            index: labels[labelId],
            key: function(key) {
                return 'labels.' + labels[labelId] + '.' + key;
            }
        }
    }
};

InputsCache = new ReactiveDict('inputsCache');

Blaze.registerHelper('inputCache', function (formName, formInstance) {
    var key = formName.toString() + '-' + formInstance.toString();
    return InputsCache.get(key);
});
