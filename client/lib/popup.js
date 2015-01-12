Popup = {
    /// This function returns a callback that can be used in an event map:
    ///
    ///   Template.tplName.events({
    ///      'click .elementClass': Popup.open("popupName")
    ///   });
    ///
    /// The popup inherit the data context of its parent.
    open: function(name) {
        var self = this;
        var popupName = name + "Popup";

        return function(evt, tpl) {
            var $element = tpl.$(evt.currentTarget);
            evt.originalEvent.clickInPopup = true
            self._render({
                __isPopup: true,
                popupName: popupName,
                hasPopupParent: self._hasPopupParent(),
                title: self._getTitle(popupName),
                offset: self._getOffset($element),
                dataContext: this
            });
            evt.preventDefault();
        }
    },

    /// This function returns a callback that can be used in an event map:
    ///
    ///   Template.tplName.events({
    ///      'click .elementClass': Popup.afterConfirm("popupName", function() {
    ///          // What to do after the user has confirmed the action
    ///      })
    ///   });
    afterConfirm: function(name, action) {
        var self = this;

        return function(evt, tpl) {
            var context = this;
            context.__afterConfirmAction = action;
            self.open(name).call(context, evt, tpl);
        }
    },

    // In case the popup was opened from a parent popup we can get back to it
    // with this `Popup.back()` function.
    back: function() {
        if (this._stack.length >= 2) {
            this._stack.pop();
            this._render(this._stack.pop());
        }
    },

    // Close the current opened popup.
    close: function() {
        if (this.current) {
            this._remove();
            this.current = null;
            this._stack = [];
        }
    },

    // The template we use for the every popup
    template: Template.popup,

    // We only want to display one popup at a time and we keep the view object
    // in this `Popup._current` variable. If there is no popup currently opened
    // the value is `null`.
    _current: null,

    // It's possible to open a sub-popup B from a popup A. In that case we keep
    // the data of popup A so we can return back to it.
    _stack: [],

    // We automatically calculate the popup offset from the element size and
    // the window dimensions.
    // XXX It should be reactive!
    _getOffset: function($element) {
        if (this._hasPopupParent())
            return this._stack[this._stack.length - 1].offset;

        var offset = $element.offset();
        var popupWidth = 300 + 15;
        return {
            left: Math.min(offset.left, $(window).width() - popupWidth),
            top: offset.top + $element.outerHeight()
        };
    },

    // We get the title from the translation files.
    // XXX It should be reactive!
    _getTitle: function(popupName) {
        var translationKey = popupName + "-title";
        // XXX There is no public API to check if there is an available
        // translation for a given key. So we try to translate the key and if
        // the translation output equals the key input we deduce that no
        // translation was available and returns `false`. There is a (small)
        // risk a false positives.
        var title = TAPi18n.__(translationKey);
        return title !== translationKey ? title : false;
    },

    // We use the blaze API to determine if the current popup has been opened
    // from a parent popup. The number we give to the `Template.parentData` has
    // been determined experimentally and is susceptible to change if you modify
    // the `Popup.template`
    _hasPopupParent: function() {
        var tryParentData = Template.parentData(3);
        return !! (tryParentData && tryParentData.__isPopup);
    },

    // Add the popup to the DOM. If a popup is already opened it will be closed
    _render: function(data) {
        this._remove();
        this._stack.push(data);
        this.current = Blaze.renderWithData(this.template, data, document.body);
    },

    // Remove the popup from the DOM
    _remove: function() {
        if (this.current) {
            Blaze.remove(this.current)
        }
    }
};

Popup.template.events({
    'click': function(event) {
        event.originalEvent.clickInPopup = true;
    },
    'click .js-back-view': function() {
        Popup.back();
    },
    'click .js-close-popover': function() {
        Popup.close();
    },
    'click .js-confirm': function() {
        Popup.close();
        this.__afterConfirmAction.call(this);
    }
});

// We automatically close a potential opened popup on any click on the document.
// To avoid closing it unexpectedly we modify the bubbled event in case the
// click event happen in the popup or in a button that open a popup.
$(document).on('click', function (event) {
    if (! (event.originalEvent && event.originalEvent.clickInPopup)) {
        Popup.close();
    }
});
