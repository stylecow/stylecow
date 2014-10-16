var assert = require('assert');
var stylecow = require('../lib');
var r;

r = stylecow.parse('rgba(23,   24, 56,   .4)', 'Value');
assert.strictEqual(r[0].toString(), 'rgba(23, 24, 56, .4)');
assert.strictEqual('Function', r[0].type);

r = stylecow.parse('font-family: Arial', 'Rule');
assert.strictEqual(r[0].toString(), 'font-family: Arial;');
assert.strictEqual('Declaration', r[0].type);

r = stylecow.parse('background-color: rgba(23, 24, 56, .4)', 'Rule');
assert.strictEqual(r[0].toString(), 'background-color: rgba(23, 24, 56, .4);');
assert.strictEqual('Declaration', r[0].type);

r = stylecow.parse('width: calc(2 + 3)', 'Rule');
assert.strictEqual(r.search('Function', {name: 'calc'})[0].name, 'calc');
assert.strictEqual('Declaration', r[0].type);

r = stylecow.parse('div.ola', 'Selector');
assert.strictEqual(r.toString(), 'div.ola');
assert.strictEqual(r.length, 2);

r = stylecow.parse('div.ola {font-size: 3em;}');
assert.strictEqual(r.toString(), 'div.ola {\n\tfont-size: 3em;\n}');
assert.strictEqual('Rule', r[0].type);

r = stylecow.parse('foo {font-size: calc(3em + (5px * 4px));}');
assert.strictEqual(r.toString(), 'foo {\n\tfont-size: calc(3em + (5px * 4px));\n}');
assert.strictEqual('Rule', r[0].type);

r = stylecow.parse('linear-gradient(rgba(23,   24, 56,   .4), #333)', 'Value');
assert.strictEqual(r.toString(), 'linear-gradient(rgba(23, 24, 56, .4), #333)');

r = stylecow.parse('div.ola', 'Selector');
assert.strictEqual(r.toString(), 'div.ola');
assert.strictEqual(r.length, 2);


r = stylecow.parse('.ola', 'Selector');
assert.strictEqual(r.toString(), '.ola');
assert.strictEqual('Keyword', r[0].type);

r = stylecow.parse('::matches(div,p  )', 'Selector');
assert.strictEqual(r.toString(), '::matches(div, p)');
assert.strictEqual('Function', r[0].type);

r = stylecow.parse('div.ola::after', 'Selector');
assert.strictEqual(true, r.has('Keyword', '::after'));

r = stylecow.parse('div.ola::after {color: blue;}');
assert.strictEqual(true, r.has('Keyword', '::after'));
assert.strictEqual(r[0], r.search('Keyword', '::after')[0].ancestor('Rule'));

//var clone = r.search('Selector')[0].clone();
//r.add(clone);
//assert.strictEqual(r, clone.ancestor('Rule'));

//r = stylecow.Rule.create('div.ola::after {color: blue; font-size: 2em;}');
//assert.strictEqual(r.clone().toString(), r.toString());

r = stylecow.parse('1px 2px 3px rgba(0, 0, 0, 0.3)', 'Value');
assert.strictEqual(r.toString(), '1px 2px 3px rgba(0, 0, 0, 0.3)');

r = stylecow.parse('box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3)', 'Value');
assert.strictEqual(r.toString(), 'box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3)');

r = stylecow.parse('color(blue alpha(0.3))', 'Value');
assert.strictEqual(r.toString(), 'color(blue alpha(0.3))');

r = stylecow.parse('@media (min-width: 500px) {color: blue;}');
assert.strictEqual(r[0].name, '(min-width: 500px)');
assert.strictEqual(r[0].length, 1);
