
main:
	browserify -t reactify index.js -o web/commented.js -d

watch:
	watchify -t reactify index.js -o web/commented.js -d
