.PHONY: all \
	build-all \
	build-app \
	build-widgets \
	compile-app \
	compile-widgets \
	stage setup \
	clean-stage-app \
	clean-stage-widgets \
	clean-maps \
	clean \
	check

DIST=./dist/
STAGE=./stage/
SRC=./src/
IMAGES=resources/images/

CC=webpack --progress --cache --bail --config

define link-site-styles
	node -e "\
		var fs = require('fs'); \
		var sites = require('../sites.json'); \
		var base = require('path').resolve('./client/resources/css/sites/'); \
		Object.keys(sites).forEach(alias => { \
			if(typeof sites[alias] === 'string') { \
				var src = base + sites[alias]; \
				var dest = base + alias; \
				try{ fs.symlinkSync(src, dest, 'dir'); } \
				catch (e) { console.warn(e.message); } \
			}\
		});\
		"
endef

export NODE_ENV="production"

all: build-all


setup:
	@rm -rf node_modules
	@npm install


check:
	@eslint --ext .js,.jsx .


build-all: build-app build-widgets
## will silently fail if stage is not empty.
	@rm -d $(STAGE) &> /dev/null || true

build-app: compile-app clean-dist-app
	@mkdir -p $(DIST)
	@mv -f $(STAGE)client $(DIST)client
	@mv -f $(STAGE)server $(DIST)server
	@(cd $(DIST) && $(call link-site-styles))

build-widgets: compile-widgets clean-dist-widgets
	@mkdir -p $(DIST)
	@mv -f $(STAGE)widgets $(DIST)widgets

compile-app: stage clean-stage-app $(STAGE)server
## copy static assets
	@(cd $(SRC)main; rsync -R *.* ../../$(STAGE)client)
	@(cd $(SRC)main; rsync -R $(IMAGES)*.* ../../$(STAGE)client)
##compile
	@$(CC) ./webpack/app.config.dist.js
##compile static site css
	@$(CC) ./webpack/site-styles.config.js

compile-widgets: $(STAGE) clean-stage-widgets
	@(cd src/main; rsync -R widgets/**/*.html ../../stage/)
	@$(CC) ./webpack/widgets.config.js


$(STAGE)server:
##the server code doesn't compile, just copy it.
	@cp -r $(SRC)server $(STAGE)server

stage:
	@mkdir -p $(STAGE)client
	@mkdir -p $(STAGE)server


clean-dist-app:
	@rm -rf $(DIST)client
	@rm -rf $(DIST)server

clean-stage-app:
	@rm -rf $(STAGE)client
	@rm -rf $(STAGE)server


clean-dist-widgets:
	@rm -rf $(DIST)widgets

clean-stage-widgets:
	@rm -rf $(STAGE)widgets

clean-maps:
	@find ./dist/client -name "*.map" -type f -delete
	@find ./dist/client -name "*.map.gz" -type f -delete

clean:
	@rm -rf $(STAGE) $(DIST)
