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

Router.route('/profile/:_id', {
    name: 'Profile',
    template: 'profile',
    layoutTemplate: 'AuthLayout',
    bodyClass: 'page-index chrome chrome-39 mac large-window body-webkit-scrollbars tabbed-page'
});

Router.route('/settings', {
    name: 'Settings',
    template: 'settings',
    layoutTemplate: 'AuthLayout',
    bodyClass: 'page-index chrome chrome-39 mac large-window body-webkit-scrollbars tabbed-page'
});

