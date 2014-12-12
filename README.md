

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

`grunt`

#### Git Pre-Commit Hook:
Put this bash script in the `.git/hooks/pre-commit`:
   
	#!/bin/sh
	FILES=`git diff --cached --name-only | grep -i ".jsx\?$"`

	for f in $FILES
	do
		if [ ! -f $f ]; then  #file was deleted
			continue
		fi
	
		jsxhint $(pwd)/$f || exit 1;
	done