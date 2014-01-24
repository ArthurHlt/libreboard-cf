/*
* 
* DEPLOY PRODUCTION Metrello
*
* Config Object {} --> private/conf.js
*
*/

var server = require("./production"),
    conf = require("./conf");


server.Production(function(server) {
    server.connect(function(command) {

        // git pull update repo
        command(conf.COMMANDS.trello_repo_update, function(data, conn) {
       
            // close connection
            conn.end(); 
        });
    });
}, "yasaricli.com")
