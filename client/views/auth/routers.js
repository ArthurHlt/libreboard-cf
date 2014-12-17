Router.route('/login', {
    name: 'Login',
    template: 'login',
    layoutTemplate: 'StaticLayout',
    bodyClass: 'account-page'
});

Router.route('/signup', {
    name: 'Signup',
    template: 'signup',
    layoutTemplate: 'StaticLayout',
    bodyClass: 'account-page'
});
