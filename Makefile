export PATH := $(shell npm bin):$(PATH)

lib: src node_modules
	-mkdir $@
	babel $< -d $@

node_modules: package.json
	npm i
	touch node_modules

.PHONY: test
test: node_modules
	jest

.PHONY: lint-fix
lint-fix: node_modules
	eslint --fix "./src/**/*.js"

.PHONY: clean
clean:
	-rm -rf node_modules
	-rm -rf lib
