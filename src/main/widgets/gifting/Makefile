.PHONY: all build compile clean check

DIST=./dist/
CC=../../../../node_modules/.bin/webpack
C_FLAGS=--progress --cache --bail --silent


all: build

check:
	@eslint --ext .js,.jsx .

clean:
	@rm -rf $(DIST)

compile: clean
	@NODE_ENV="production" $(CC) $(C_FLAGS)

build: compile
	@cp ./src/index.html $(DIST)
##Pre-Compress
	@find $(DIST) -type f \( -name '*.js' -o -name '*.css' -o -name '*.svg' -o -name '*.map' \) -exec gzip -k -v -f -9 {} \;
## Capture versions
	@npm la 2>/dev/null > $(DIST)js/versions.txt
	@npm ls 2>/dev/null | grep nti- | sed -e 's/^[\│\├\─\┬\└\ ]\{1,\}/z /g' | sort | sed -e 's/^z/-/g' > $(DIST)js/nti-versions.txt
