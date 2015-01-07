var stylecow = require(__dirname + '/../lib');
var fs = require('fs');
var assert = require('assert');

var code = stylecow.Reader.readFile('test.css');
var expected = fs.readFileSync('test.expected.css', 'utf8');

var css = stylecow.Root.create(code);

assert.equal(css.toString(), expected);
