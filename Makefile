.PHONY: all
.PHONY: build-all
.PHONY: build-app
.PHONY: build-widgets
.PHONY: build-schema
.PHONY: compile-app
.PHONY: compile-widgets
.PHONY: stage
.PHONY: setup
.PHONY: clean-stage-app
.PHONY: clean-stage-widgets
.PHONY: clean
.PHONY: check


DIST=./dist/
STAGE=./stage/
SRC=./src/
SCHEMA=./data/
IMAGES=resources/images/

CC=webpack --progress --cache --bail --config

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

build-widgets: compile-widgets clean-dist-widgets
	@mkdir -p $(DIST)
	@mv -f $(STAGE)widgets $(DIST)widgets

build-schema:
	@babel-node ./src/server/schema/update.js


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

clean:
	@rm -rf $(STAGE) $(DIST) $(SCHEMA)