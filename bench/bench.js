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
	.use(require('stylecow-plugin-calc'))
	.use(require('stylecow-plugin-color'))
	.use(require('stylecow-plugin-custom-media'))
	.use(require('stylecow-plugin-custom-selector'))
	.use(require('stylecow-plugin-fixes'))
	.use(require('stylecow-plugin-flex'))
	.use(require('stylecow-plugin-import'))
	.use(require('stylecow-plugin-matches'))
	.use(require('stylecow-plugin-nested-rules'))
	.use(require('stylecow-plugin-prefixes'))
	.use(require('stylecow-plugin-rem'))
	.use(require('stylecow-plugin-variables'))
	.use(require('stylecow-plugin-webkit-gradient'));

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
