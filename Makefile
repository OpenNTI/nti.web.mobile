.PHONY: all
.PHONY: build-all
.PHONY: build-app
.PHONY: build-widgets
.PHONY: build-schema
.PHONY: compile-app
.PHONY: compile-widgets
.PHONY: stage
.PHONY: clean-stage-app
.PHONY: clean-stage-widgets
.PHONY: clean


DIST=./dist/
STAGE=./stage/
SRC=./src/
SCHEMA=./data/
IMAGES=resources/images/

export NODE_ENV="production"

all: build-all

build-all: build-app build-widgets
## will silently fail if stage is not empty.
	@rm -d $(STAGE) &> /dev/null || true

build-app: compile-app
	@mkdir -p $(DIST)
	@mv $(STAGE)client $(DIST)client
	@mv $(STAGE)server $(DIST)server

build-widgets: compile-widgets
	@mkdir -p $(DIST)
	@mv $(STAGE)widgets $(DIST)widgets

build-schema:
	@babel-node ./src/server/schema/update.js


compile-app: stage clean-stage-app $(STAGE)server
## copy static assets
	@(cd $(SRC)main; rsync -R *.* ../../$(STAGE)client)
	@(cd $(SRC)main; rsync -R $(IMAGES)*.* ../../$(STAGE)client)
##compile
	@webpack --config ./webpack/app.config.dist.js --progress --cache --bail
##compile static site css
	@webpack --config ./webpack/site-styles.config.js --progress --cache --bail

compile-widgets: $(STAGE) clean-stage-widgets
	@(cd src/main; rsync -R widgets/**/*.html ../../stage/)
	@webpack --config ./webpack/widgets.config.js --progress --cache --bail


$(STAGE)server:
##the server code doesn't compile, just copy it.
	@cp -r $(SRC)server $(STAGE)server

stage:
	@mkdir -p stage/client
	@mkdir -p stage/server


clean-stage-app:
	@rm -rf stage/client
	@rm -rf stage/server

clean-stage-widgets:
	@rm -rf stage/widgets

clean:
	@rm -rf stage dist data
