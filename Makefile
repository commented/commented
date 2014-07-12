
main:
	browserify -t reactify index.js -o web/commented.js -d

less:
	lessc index.less web/build.css

watch:
	watchify -t reactify index.js -o web/commented.js -d

docit:
	browserify -t reactify index.js | uglifyjs > docs-theme/js/commented.min.js

lint:
	jsxhint -e .jsx lib

.PHONY: less main watch lint
