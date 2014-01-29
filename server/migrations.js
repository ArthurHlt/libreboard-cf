(function() {
    Meteor.startup(function() {
    
        // test migrate
        Meteor.Migrations.add('1', function(log) {
         
            log.info('Hello migrations!');
        });
    });

    var list = Meteor.Migrations.list();
    console.log(list.fetch());
}());
