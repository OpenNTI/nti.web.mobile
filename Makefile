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
	check \
	test

DIST=./dist/
STAGE=./stage/
SRC=./src/
IMAGES=resources/images/

CC=webpack --progress --cache --bail --config


# all: clean build-app
all: build-all


setup:
	@rm -rf node_modules
	@npm install

test:
	@karma start --single-run

check:
	@eslint --ext .js,.jsx .


build-all: build-app build-widgets
## will silently fail if stage is not empty.
	@rm -d $(STAGE) &> /dev/null || true

build-app: compile-app clean-dist-app
	@mkdir -p $(DIST)
	@mv -f $(STAGE)client $(DIST)client
	@mv -f $(STAGE)server $(DIST)server
##Pre-Compress
	@find $(DIST)client -type f \( -name '*.js' -o -name '*.css' -o -name '*.svg' -o -name '*.map' \) -exec gzip -k -v -f -9 {} \;
## Capture versions
	@npm la 2>/dev/null > $(DIST)client/js/versions.txt
	@npm ls 2>/dev/null | grep nti- | sed -e 's/^[\│\├\─\┬\└\ ]\{1,\}/z /g' | sort | sed -e 's/^z/-/g' > $(DIST)client/js/nti-versions.txt


build-widgets: compile-widgets clean-dist-widgets
	@mkdir -p $(DIST)
	@mv -f $(STAGE)widgets $(DIST)widgets
##Pre-Compress
	@find $(DIST)widgets -type f \( -name '*.js' -o -name '*.css' -o -name '*.svg' -o -name '*.map' \) -exec gzip -k -v -f -9 {} \;

compile-app: stage clean-stage-app $(STAGE)server
## copy static assets
	@(cd $(SRC)main; rsync -R *.* ../../$(STAGE)client)
	@(cd $(SRC)main; rsync -R $(IMAGES)*.* ../../$(STAGE)client)
##compile
	@NODE_ENV="production" $(CC) ./webpack/app.config.js

compile-widgets: $(STAGE) clean-stage-widgets
	@(cd src/main; rsync -R widgets/**/*.html ../../stage/)
	@NODE_ENV="production" $(CC) ./webpack/widgets.config.js


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
