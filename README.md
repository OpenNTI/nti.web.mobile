

## Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org):
  	* On Mac use `[sudo] port install nodejs npm`
  	* Otherwise use the installer provided on the NodeJS website.
  * [Grunt](http://gruntjs.com/): Run `[sudo] npm install -g grunt-cli`
  * [Bower](http://bower.io): Run `[sudo] npm install -g bower`

## Quickstart

```bash
git clone ssh://repos.nextthought.com/nextthought-webapp-mobile
npm install && bower install
```

While you're working on this project, run:

```bash
grunt
```

#### Git Pre-Commit Hook:

Make sure you have `jshint` and `jsxhint` installed "globally."
```bash
npm install jshint -g
npm install jsxhint -g
```

Activate the hook:

```bash
cp ./pre-commit.sample .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```
