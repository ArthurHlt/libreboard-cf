
/*********************************************
*
* Trello collects helper functions...
* 
***********************************************/

(function() {

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    if (Meteor.isClient) {

        // Base Template helpers
        root.Helpers = function(template, obj) {
            return Template[template].helpers(_.extend({
                /*
                *
                * error messages {{ error_message }} 
                * 
                *       set error("error then :)");
                */
                error_message: function() {
                    return Session.get("error_message");
                },
                gravatar: function(size) {
                    var user = Meteor.user();
                    return get_gravatar(user.emails[0].address, size);
                }
            }, obj));
        };

        root.ShowPop = function(title, template, css_klass) {
            Session.set("show_pop", true);
            Session.set("pop_title", title);
            Session.set("pop_css_klass", css_klass)
            Session.set("pop_" + template, true);
        };

        root.HidePop = function() {
            Session.set("show_pop", false);
        };

        // if not args.elem.val then run succes callback else fail callback  
        root.elemVal = function(elem, success, fail) {
            (fail || (fail = function() {}));
            var val = elem.val();

            if (jQuery.trim(val)) { 
                success(elem, val, slugify(val));
                elem.val("");
                return;
            }
            return fail(val);
        }; 

        root.get_gravatar = function(email, size) {
            var size = size || 80;
            return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?s=' + size;
        };

        // list area width
        root.updateListAreaWidth = function() {
            var lists = jQuery(".list"),
                width = (lists.length * lists.width()) + 350;
            jQuery(".list-area").width(width);
        };

        root.updateListHeight = function() {
            var canvas_height = $(".board-canvas").height(),
                form_height = jQuery(".CardAddForm").height(),
                height = (canvas_height - form_height);
            jQuery(".list-cards").css("max-height", height + "px");
        };

        root.focusTextareaAnimate = function($target) {
            var height = ($target.height() + 300);
            $target.animate({scrollTop: height}, 1);
        };

        root.blurClickSubmit = function(related, success) {
            if (related && related.attr("type") == "submit") {
                related.trigger("click");
                return false;
            }
            success();
        };

        root.startup = function(callback) {
                var body = $("body"),
                    addClass;
                body.removeAttr("class");
                addClass = function() { 
                    return _.each(arguments, function(cl) {
                        body.addClass(cl); 
                    }); 
                };

                // run callback
                callback(addClass);

                // add classes base 
                addClass("extra-large-window");
        };

        root.Rendered = function(template, callback) {
            Template[template].rendered = function() {
                startup(callback)
            };
        }

        root.isPage = function(name) {
            return Meteor.Router.page() == name
        }
    }
}());
