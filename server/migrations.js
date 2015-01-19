// Anytime you change the schema of one of the collection in a non-backward
// compatible way you have to write a migration in this file using the following
// API:
//
//   Migrations.add(name, migrationCallback, optionalOrder);

Migrations.add('board-background-color', function() {
    var defaultColor = '#16A085';
    Boards.update({
        background: {
            $exists: false
        }
    }, {
        $set: {
            background: {
                type: 'color',
                color: defaultColor
            }
        }
    }, {
        multi: true
    });
});

Migrations.add('lowercase-board-permission', function() {
    _.forEach(['Public', 'Private'], function(permission) {
        Boards.update(
            { permission: permission },
            { $set: { permission: permission.toLowerCase() } },
            { multi: true }
        );
    });
});
