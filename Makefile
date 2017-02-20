.PHONY: all build compile setup clean clean-maps check test

DIST=./dist/
SRC=./src/
IMAGES=resources/images/
CC=webpack
C_FLAGS=--progress --cache --bail


all: build

setup:
	@rm -rf node_modules
	@npm install

test:
	@karma start --single-run

check:
	@eslint --ext .js,.jsx .

build: compile
##Pre-Compress
	@find $(DIST)client -type f \( -name '*.js' -o -name '*.css' -o -name '*.svg' -o -name '*.map' \) -exec gzip -k -v -f -9 {} \;
## Capture versions
	@npm la 2>/dev/null > $(DIST)client/js/versions.txt
	@npm ls 2>/dev/null | grep nti- | sed -e 's/^[\│\├\─\┬\└\ ]\{1,\}/z /g' | sort | sed -e 's/^z/-/g' > $(DIST)client/js/nti-versions.txt

compile: clean
	@mkdir -p $(DIST)
##the server code doesn't compile, just copy it.
	@cp -r $(SRC)server/ $(DIST)server/
## copy static assets
	@(cd $(SRC)main; rsync -R *.* ../../$(DIST)client)
	@(cd $(SRC)main; rsync -R $(IMAGES)*.* ../../$(DIST)client)
##compile
	@NODE_ENV="production" $(CC) $(C_FLAGS)

clean-maps:
	@find $(DIST)client -type f \( -name '*.map' -o -name '*.map.gz' \) -delete

clean:
	@rm -rf $(DIST)
