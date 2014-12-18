// Default sessions
Session.setDefault('error', false);

/*
* If you want to use a default layout template for all routes you can 
* configure a global Router option.
*/
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notfound',

    /*
    * onBeforeAction hooks now require you to call this.next(), 
    * and no longer take a pause() argument. So the default behaviour is reversed. 
    * ClassMapper body add, remove class.
    */
    onBeforeAction: function() {
        var body = $('body'),
            bodyClass = this.route.options["bodyClass"];
     
        // Remove class attribute body
        body.removeAttr('class');

        // if klass iron router name currentRouter then add Class
        if (bodyClass) body.addClass(bodyClass);

        // reset default sessions
        Session.set('error', false);
        Session.set('pop', false);

        // next
        this.next();
    }
});

Router.route('/', {
    name: 'Home',
    template: 'home'
});
