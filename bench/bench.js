var Benchmark = require('benchmark');
var stylecow = require('../lib');
var postcss = require('postcss');
var fs = require('fs');

//Configure stylecow
stylecow
	.loadPlugin('import')
	.loadPlugin('variables')
	.loadPlugin('nested-rules')
	.loadPlugin('custom-selector')
	.loadPlugin('custom-media')
	.loadPlugin('calc')
	.loadPlugin('color')
	.loadPlugin('matches')
	.loadPlugin('prefixes');

//Configure postcss
var postcssConfig = postcss()
	.use(require('postcss-import')())
	.use(require('postcss-custom-properties')())
	.use(require('postcss-nested')())
	.use(require('postcss-custom-selectors')())
	.use(require('postcss-custom-media')())
	.use(require('postcss-calc')())
	.use(require('postcss-color-function')())
	.use(require('postcss-color-hex-alpha')())
	.use(require('postcss-color-gray')())
	.use(require('postcss-selector-matches')())
	.use(require('autoprefixer-core')());

var suite = new Benchmark.Suite;

var results = {
	stylecow: '',
	postcss: ''
};

suite.add('stylecow', function() {
	var css = stylecow.parseFile(__dirname + '/assets/input.css');
	stylecow.run(css);

	results.stylecow = css.toString();
})
.add('postcss', function() {
	var css = postcssConfig.process(fs.readFileSync(__dirname + '/assets/input.css', 'utf8'), {
		from: __dirname + '/assets/input.css'
	}).css;
	
	results.postcss = css.toString();
})
.on('cycle', function(event) {
	console.log(String(event.target));
})
.on('complete', function() {
	console.log('Fastest is ' + this.filter('fastest').pluck('name'));
	/*
	console.log('');
	console.log('================');
	console.log('STYLECOW RESULT:');
	console.log('');
	console.log(results.stylecow);
	console.log('');
	console.log('================');
	console.log('POSTCSS RESULT:');
	console.log('');
	console.log(results.postcss);
	console.log('');
	*/
})
.run();
