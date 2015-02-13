

## Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org):
  	* Use the installer provided on the NodeJS website. (currently v0.10.x is what we support)
  * [React Tools](http://facebook.github.io/react/): Run `[sudo] npm install -g react-tools`
  * [Grunt](http://gruntjs.com/): Run `[sudo] npm install -g grunt-cli`
  * [Bower](http://bower.io): Run `[sudo] npm install -g bower`

## Quickstart

```bash
git clone ssh://repos.nextthought.com/nextthought-webapp-mobile
cd nextthought-webapp-mobile
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



# Working on dependent projects:

### The server interface:

Clone the library, install its dependent modules, and `npm-link` it.

```bash
git clone ssh://repos.nextthought.com/nti.node.dataserverinterface
cd nti.node.dataserverinterface
npm install
npm link
```

from `nextthought-webapp-mobile`:

```bash
npm link dataserverinterface
```

---

### The Editor

Clone the library, install its dependent modules, and `npm-link` it.

```bash
git clone https://git@github.com/NextThought/react-editor-component.git
cd react-editor-component
npm install
npm link
```

from `nextthought-webapp-mobile`:

```bash
npm link react-editor-component
```
