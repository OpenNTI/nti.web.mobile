

### Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org):
    * Use [nvm](https://github.com/creationix/nvm) to install NodeJS.
        * `nvm install v6.9.4`
        * Setup default node:
          ```bash
          nvm alias default stable
          ```
  * [Karma](http://karma-runner.github.io): Run `npm install -g karma-cli`

Optional:
  * Node Inspector: `npm install -g node-inspector`


##### File naming conventions:
- Mixins/Partials and utility files: `lower-case-hyphenated.js` (in a sub-directory grouping related ones together)
- Classes, Components, and Special-Meaning* files: `PascalNameCase.js(x)`

* Special-Meaning: Actions.js, Api.js, Constants.js, Store.js -- these files are special.

### Special-Meaning files

Files with special meaning should be consistent across all modules & libraries. They belong at the root of a module.

Example directory structure:
```
module-dir:
 ├ components
 │  ├ assets
 │  │  └ ...png
 │  ├ some-usefull-directory-grouping-of-components
 │  │  ├ assets
 │  │  │  └ ...png
 │  │  └ ...jsx
 │  ├ SomeComponent.jsx
 │  ├ SomeComponent.scss
 │  └ index.js
 ├ something-usefull
 │  ├ ...
 │  └ index.js
 ├ Actions.js   (only functions, each MUST do work then dispatch. No sub-Action files. All module actions go here.)
 ├ Api.js       (Interactions with externals...)
 ├ Constants.js (Only constant values)
 ├ Store.js     (exports a single store instance)
 ├ index.js
 ├ whatever.js
 └ utils.js
```

Modules should not contain sub-modules. They can however inter-depend.

#### private npm
All internal projects at NextThought are published into a private npm instance. You will need to configure npm to point to it before you can continue. It is located at https://npm.nextthought.com. For read-only access use the support credentials. When/if you need publishing (write) permissions, we can create a unique user for you.

```bash
npm set registry https://npm.nextthought.com
npm login --registry https://npm.nextthought.com
```

## Quickstart

```bash
git clone ssh://repos.nextthought.com/nti.web.mobile
cd nti.web.mobile
npm install
```

While you're working on this project, run:

```bash
npm start
```

##### Building:
```bash
$ make
```

##### Running Tests:
```bash
#for continuous integration (calls karma with extra reports, see package.json)
$ npm test

# for dev (single run, basic report)
$ karma start

# for dev (watch mode)
$ karma start --auto-watch --no-single-run --reporters dots
```

***Please read:*** `doc/source control workflow.md`, it outlines how this project is worked on.


---

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

---

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

---

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
