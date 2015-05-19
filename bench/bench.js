var Benchmark = require('benchmark');
var stylecow = require('../lib');
var postcss = require('postcss');
var fs = require('fs');

//Configure stylecow
stylecow
	.minSupport('> 1%')
	.loadPlugin('calc')
	.loadPlugin('color')
	.loadPlugin('custom-media')
	.loadPlugin('custom-selector')
	.loadPlugin('fixes')
	.loadPlugin('flex')
	.loadPlugin('import')
	.loadPlugin('matches')
	.loadPlugin('nested-rules')
	.loadPlugin('prefixes')
	.loadPlugin('rem')
	.loadPlugin('variables');

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
