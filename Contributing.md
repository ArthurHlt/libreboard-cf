# Contributing

We welcome bug reports, enhancement ideas, and pull requests, in our github bug
tracker. Before opening a new thread please verify if your issue hasn't already
been reported.

> https://github.com/libreboard/libreboard

LibreBoard is made with [Meteor](https://www.meteor.com/).

## Translations

You are very welcome to translate — or improve the translation of — LibreBoard
in your locale language. For that purpose we rely on
[Transifex](https://www.transifex.com/organization/libreboard/dashboard/libreboard).
So the first step is to create a Transifex account if you don't have one
already. You can then send a request to join one of the translation teams. If
there is no team for your language, contact us by email or with github issues
and we will create a new one.

## Installation

## install nodejs on Ubuntu

```
$ sudo apt-get install python-software-properties
$ sudo add-apt-repository ppa:chris-lea/node.js
$ sudo apt-get update
$ sudo apt-get install nodejs nodejs-dev npm
```

## install nodejs on Mac OSX

```
$ brew update
$ brew install node

## install meteor

```
$ curl https://install.meteor.com/ | sh
```

## Clone and run

```
$ git clone https://github.com/libreboard/libreboard
$ cd libreboard
$ meteor run
```

## Style guide

We follow the
[meteor style guide](https://github.com/meteor/meteor/wiki/Meteor-Style-Guide)
with the following modifications:

* 4 space indents
* indent with spaces, not literal tabs

## Pull requests

1. Fork it
2. Create your feature branch (git checkout -b new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin new-feature)
5. Create new Pull Request

## Code organisation

