var Benchmark = require('benchmark');
var stylecow = require('stylecow-core');
var postcss = require('postcss');
var fs = require('fs');

//Configure stylecow
stylecow
	.minSupport({
		explorer: 8,
		firefox: 37,
		chrome: 42,
		safari: 8,
		opera: 15,
		android: 4,
		safari: 6
	})
	.loadNpmModule('stylecow-plugin-calc')
	.loadNpmModule('stylecow-plugin-color')
	.loadNpmModule('stylecow-plugin-custom-media')
	.loadNpmModule('stylecow-plugin-custom-selector')
	.loadNpmModule('stylecow-plugin-fixes')
	.loadNpmModule('stylecow-plugin-flex')
	.loadNpmModule('stylecow-plugin-import')
	.loadNpmModule('stylecow-plugin-matches')
	.loadNpmModule('stylecow-plugin-nested-rules')
	.loadNpmModule('stylecow-plugin-prefixes')
	.loadNpmModule('stylecow-plugin-rem')
	.loadNpmModule('stylecow-plugin-variables');

//Configure postcss with cssnext
var cssnext = postcss()
	.use(require("cssnext")());

var suite = new Benchmark.Suite;

var results = {
	stylecow: '',
	cssnext: ''
};

suite.add('stylecow', function() {
	var css = stylecow.parseFile(__dirname + '/css/main.css');
	stylecow.run(css);

	results.stylecow = css.toString();
})
.add('cssnext', function() {
	var css = cssnext.process(fs.readFileSync(__dirname + '/css/main.css', 'utf8'), {
		from: __dirname + '/css/main.css'
	}).css;
	
	results.cssnext = css.toString();
})
.on('cycle', function(event) {
	console.log(String(event.target));
})
.on('complete', function() {
	console.log('Fastest is ' + this.filter('fastest').pluck('name'));
	fs.writeFileSync(__dirname + '/stylecow.css', results.stylecow);
	fs.writeFileSync(__dirname + '/cssnext.css', results.cssnext);
})
.run();
