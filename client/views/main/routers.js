/*
* If you want to use a default layout template for all routes you can 
* configure a global Router option.
*/
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notfound'
});

Router.route('/', {
    name: 'Home',
    template: 'home'
});
