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
        var ClassMapper = {
                'Signup': 'account-page',
                'Login': 'account-page'
            },
            klass = ClassMapper[this.route.getName()],
            body = $('body');
       
        // if klass Router name then add else remove attribute all class..
        klass ? body.addClass(klass) : body.removeAttr('class');

        // next
        this.next();
    }
});

Router.route('/', {
    name: 'Home',
    template: 'home'
});
