/*
* If you want to use a default layout template for all routes you can 
* configure a global Router option.
*/
Router.configure({
    loadingTemplate: 'loading',
    notFoundTemplate: 'notfound',

    /*
    * onBeforeAction hooks now require you to call this.next(), 
    * and no longer take a pause() argument. So the default behaviour is reversed. 
    * ClassMapper body add, remove class.
    */
    onBeforeAction: function(pause) {
        var body = $('body'),
            options = this.route.options,
            bodyClass = options["bodyClass"];
     
        // Remove class attribute body
        body.removeAttr('class');

        // if klass iron router name currentRouter then add Class
        if (bodyClass) body.addClass(bodyClass);

        // reset default sessions
        Session.set('error', false);
        Session.set('pop', false);
        Session.set('warning', false);
        Session.set('widgets', true);

        // all pages pop close
        Utils.Pop.close();

        // Layout template found then set render this.route options layout.
        if (!options.layoutTemplate) {
        
            // if user undefined then layout render 
            if (!Meteor.user()) this.layout('layout');  

            // user found then AuthLayout render  
            else this.layout('AuthLayout'); 
        }

        // Next 
        this.next();
    }
});

Router.route('/', {
    name: 'Home',
    template: 'home',
    layoutTemplate: 'LandingLayout'
});
