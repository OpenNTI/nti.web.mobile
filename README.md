

### Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org):
    * Use [nvm](https://github.com/creationix/nvm) to install NodeJS.
        * `nvm install v0.12.7`
        * Setup default node:
          ```bash
          echo v0.12.7 > ~/.nvmrc
          ```
          or
          ```
          nvm alias default 0.12.7
          ```
  * [Grunt](http://gruntjs.com): Run `npm install -g grunt-cli`
  * [Karma](http://karma-runner.github.io): Run `npm install -g karma-cli`

Optional:
  * Node Inspector: `npm install -g node-inspector`



## Quickstart

```bash
git clone ssh://repos.nextthought.com/nti.web.mobile
cd nti.web.mobile
npm install
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

Make sure you have `eslint` installed "globally."
```bash
npm install eslint -g
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
| nti.lib.anchors        | ssh://repos.nextthought.com/nti.lib.anchorjs             |
| nti.lib.dom            | ssh://repos.nextthought.com/nti.lib.domjs                |
| nti.lib.interfaces     | ssh://repos.nextthought.com/nti.lib.interfaces           |
| nti.lib.ranges         | ssh://repos.nextthought.com/nti.lib.ranges               |
| nti.lib.whiteboardjs   | ssh://repos.nextthought.com/nti.lib.whiteboardjs         |
| react-editor-component | git@github.com:NextThought/react-editor-component.git    |


--

### Text Editor

[Atom](https://atom.io/) is the main editor editor used. Built on open web tech, for web tech :)

You can use the package manger either in app on on the command line with `apm` (like `npm`)

#### These packages are a **must**:
 * `linter` - shows errors in files as you type/save.
 * `linter-eslint` - linter plugin to run eslint on files.

#### These are helpfull:
 * `project-quick-open` - quickly open/switch to projects.
 * `merge-conflicts` - a merge conflict ui
 * `docblockr` - auto formats jsdoc comment blocks. as well as sippets.
 * `autocomplete-modules` - adds autocomplete suggestions your resolvable packages.
 * `git-plus` - an awesome git command pallet (branch, checkout/revert, commit, push, pull, etc)
 * `git-history` - search git history and show the diff.
 * `language-gitignore` - makes commit messages colored
 * `react` - Adds code snippets and syntax coloring for JSX.

#### These are fun:
 * `autocomplete-emojis` - self explanatory
 * `file-icons` - makes file icons code-type specific.

[Sublime Text](http://www.sublimetext.com/) is another text editor available. As well as [TextMate](http://macromates.com/download).

As long as you can have a LIVE eslint plugin with your editor, you should be good to go. If you prefer an editor that can't do that, you need to run `grunt lint` pretty regularly.
