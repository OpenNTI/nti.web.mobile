

### Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org):
    * Use [nvm](https://github.com/creationix/nvm) to install NodeJS.
        * `nvm install v0.10.38`
        * Setup default node:
          ```bash
          echo v0.10.38 > ~/.nvmrc
          ```
  * [Grunt](http://gruntjs.com): Run `npm install -g grunt-cli`
  * [Bower](http://bower.io): Run `npm install -g bower`
  * [Karma](http://karma-runner.github.io): Run `npm install -g karma-cli`

Optional:
  * Node Inspector: `npm install -g node-inspector`



## Quickstart

```bash
git clone ssh://repos.nextthought.com/nti.web.mobile
cd nti.web.mobile
npm install && bower install
```

While you're working on this project, run:

```bash
grunt
```

***Please read:*** `doc/source control workflow.md`, it outlines how this project is worked on.

--

### Recommended

If you haven't already done so, configure `git` to make all new branches rebase on pull by default:
```bash
git config branch.autosetuprebase always --global
```

Set `master`, `develop` to default to rebase on pull
```bash
git config branch.master.rebase true
git config branch.develop.rebase true
```

I can't make this change centrally. It must be made per-clone.  This explains why you would want to rebase on pull: http://stevenharman.net/git-pull-with-automatic-rebase

It basically simplifies your interactions. so you can simply `git pull` to get updated code, instead of `git pull -r` or `git fetch && git rebase... ` etc. With out this change, a `git pull` will make a merge bubble, and thats just ugly.


--

### Git Pre-Commit Hook:

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

--

## Working on dependent projects:

Clone the library, install its dependent modules, and `npm-link` it.

```bash
git clone {repository:source} {dependency-name}
cd {dependency-name}
npm install
npm link
```

from `nti.web.mobile`:

```bash
npm link {dependency-name}
```

| dependency-name        | repository:source                                        |
|------------------------|----------------------------------------------------------|
| nti.lib.interfaces     | ssh://repos.nextthought.com/nti.lib.interfaces           |
| nti.lib.anchors        | ssh://repos.nextthought.com/nti.lib.anchorjs             |
| nti.lib.dom            | ssh://repos.nextthought.com/nti.lib.domjs                |
| react-editor-component | git@github.com:NextThought/react-editor-component.git    |


--

### Sublime Text Snippets
If you're using Sublime Text you can install the [NextThought snippets package](https://github.com/themaxx/nt-sublime-snippets) via package control.
