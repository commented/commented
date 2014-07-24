
main:
	browserify -t [ reactify --es6 ] -t es6ify index.js -o web/commented.js -d

less:
	lessc index.less web/build.css

watch:
	watchify -t [ reactify --es6 ] -t es6ify index.js -o web/commented.js -d -v

docit:
	browserify -t reactify -t es6ify index.js | uglifyjs > docs-theme/js/commented.min.js
	lessc index.less | cleancss -o docs-theme/css/commented.min.css

lint:
	jsxhint -e .jsx lib

serve-web:
	@cd web; python -m SimpleHTTPServer 3000

serve:
	@deactivate; . ~/.virtualenv/other/bin/activate; mkdocs serve --dev-addr=0.0.0.0:5001

build-docs:
	@deactivate; . ~/.virtualenv/other/bin/activate; mkdocs build

.PHONY: less main watch lint
