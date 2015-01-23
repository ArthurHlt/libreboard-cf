// A simple tracker dependency that we invalidates every time the window is
// resized. This is used to reactively re-calculate the popup position in case
// of a window resize.
var windowResizeDep = new Tracker.Dependency;
$(window).on('resize', function() { windowResizeDep.changed() });

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
            // We determine the openerElement (the DOM element that is being
            // clicked and the one to take in reference for the popup position)
            // from the event if the popup has no parent, or from the parent
            // openerElement if it has one. That allow use to position a
            // sub-popup exactly at the same position of its parent.
            if (self._hasPopupParent()) {
                var parentData = self._stack[self._stack.length - 1];
                var openerElement = parentData.openerElement;
            } else {
                var openerElement = evt.currentTarget;
            }

            // If a popup is already openened, clicking again on the opener
            // element should close it -- and stop the current function.
            if (self.current && openerElement === evt.currentTarget) {
                return self.close();
            }

            // We modify the event to prevent the popup being closed when the
            // event bubble up to the document element.
            evt.originalEvent.clickInPopup = true;
            evt.preventDefault();

            // We push our popup data to the stack. The top of the stack is
            // always used as the data source for our current popup.
            self._stack.push({
                __isPopup: true,
                popupName: popupName,
                hasPopupParent: self._hasPopupParent(),
                title: self._getTitle(popupName),
                openerElement: openerElement,
                offset: self._getOffset(openerElement),
                dataContext: this
            });

            // If there are no popup currently opened we use the Blaze API to
            // render one into the DOM. We use a reactive function as the data
            // parameter that just return the top element on the stack and
            // depends on our internal dependency that is being invalidated
            // every time the top element of the stack has changed and we want
            // to update the popup.
            //
            // Otherwise if there is already a popup open we just need to
            // invalidate our internal dependency, and since we just changed the
            // top element of our internal stack, the popup will be updated with
            // the new data.
            if (! self.current) {
                self.current = Blaze.renderWithData(self.template, function() {
                    self._dep.depend();
                    return self._stack[self._stack.length - 1];
                }, document.body);

            } else {
                self._dep.changed();
            }
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

    /// In case the popup was opened from a parent popup we can get back to it
    /// with this `Popup.back()` function. You can go back several steps at once
    /// by providing a number to this function, e.g. `Popup.back(2)`. In this
    /// case intermediate popup won't even be rendered on the DOM.
    back: function(n) {
        n = n || 1;
        var self = this;
        if (self._stack.length >= n + 1) {
            _.times(n, function() { self._stack.pop() });
            self._dep.changed();
        }
    },

    /// Close the current opened popup.
    close: function() {
        if (this.current) {
            Blaze.remove(this.current);
            this.current = null;
            this._stack = [];
        }
    },

    // The template we use for every popup
    template: Template.popup,

    // We only want to display one popup at a time and we keep the view object
    // in this `Popup._current` variable. If there is no popup currently opened
    // the value is `null`.
    _current: null,

    // It's possible to open a sub-popup B from a popup A. In that case we keep
    // the data of popup A so we can return back to it. Every time we open a new
    // popup the stack grows, every time we go back the stack decrease, and if
    // we close the popup the stack is reseted to the empty stack [].
    _stack: [],

    // We invalidate this internal dependency every time the top of the stack
    // has changed and we want to render a popup with the new top-stack data.
    _dep: new Tracker.Dependency,

    // We use the blaze API to determine if the current popup has been opened
    // from a parent popup. The number we give to the `Template.parentData` has
    // been determined experimentally and is susceptible to change if you modify
    // the `Popup.template`
    _hasPopupParent: function() {
        var tryParentData = Template.parentData(3);
        return !! (tryParentData && tryParentData.__isPopup);
    },

    // We automatically calculate the popup offset from the reference element
    // position and dimensions. We also reactively use the window dimensions
    // to ensure that the popup is always visible on the screen.
    _getOffset: function(element) {
        var $element = $(element);
        return function() {
            windowResizeDep.depend();
            var offset = $element.offset();
            var popupWidth = 300 + 15;
            return {
                left: Math.min(offset.left, $(window).width() - popupWidth),
                top: offset.top + $element.outerHeight()
            };
        };
    },

    // We get the title from the translation files. Instead of returning the
    // result, we return a function that compute the result and since
    // `TAPi18n.__` is a reactive data source, the title will be changed
    // reactively
    _getTitle: function(popupName) {
        return function () {
            var translationKey = popupName + "-title";
            // XXX There is no public API to check if there is an available
            // translation for a given key. So we try to translate the key and
            // if the translation output equals the key input we deduce that no
            // translation was available and returns `false`. There is a (small)
            // risk a false positives.
            var title = TAPi18n.__(translationKey);
            return title !== translationKey ? title : false;
        }
    }
};

Popup.template.events({
    'click': function(event) {
        if (event.originalEvent)  {
            event.originalEvent.clickInPopup = true;
        }
    },
    'click .js-back-view': function() {
        Popup.back();
    },
    'click .js-close-popover': function() {
        Popup.close();
    },
    'click .js-confirm': function() {
        this.__afterConfirmAction.call(this);
    }
});

// We automatically close a potential opened popup on any left click on the
// document. To avoid closing it unexpectedly we modify the bubbled event in
// case the click event happen in the popup or in a button that open a popup.
$(document).on('click', function (event) {
    if (event.which === 1 &&
        ! (event.originalEvent && event.originalEvent.clickInPopup)) {
        Popup.close();
    }
});
