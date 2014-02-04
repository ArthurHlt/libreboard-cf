meteor-trello
=============

[![Build Status](https://travis-ci.org/yasaricli/meteor-trello.png)](https://travis-ci.org/yasaricli/meteor-trello)


[Show issues Metrello board :)](http://metrello.yasaricli.com/board/TXQsFCu9fyMcWYxJ7)

###### Boards View

![alt tag](http://metrello.yasaricli.com/img/boards.png)

###### Board list View

![alt tag](http://metrello.yasaricli.com/img/lists.png)

##### install nodejs 
    $ wget http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz
    $ tar -xvf node-v0.10.24.tar.gz
    $ cd node-v0.10.24
    $ ./configure && make install clean


##### install meteor and meteorite
    $ curl https://install.meteor.com/ | sh
    $ npm install -g meteorite
    
##### meteor-trello clone and run
    $ git clone https://github.com/yasaricli/meteor-trello.git
    $ cd meteor-trello
    $ meteor

##### Change version to try first branch (v0)
    $ cd meteor-trello
    $ git checkout v0
    $ meteor
    
###### use mongodb Production
    $ export MONGO_URL=mongodb://localhost:27017/dbname
    $ meteor --production 

    


