var stylecow = require(__dirname + '/../lib');
var fs = require('fs');
var assert = require('assert');

var code = stylecow.Reader.readFile('test.css');
var expected = fs.readFileSync('test.expected.css', 'utf8');

var css = new stylecow.Root();
css.parse(code);

assert.equal(css.toString(), expected);

var output = new stylecow.Coder(css, {
	style: "minify"
});

console.log(output.code);
