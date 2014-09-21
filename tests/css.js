var assert = require('assert');
var stylecow = require('../lib');
var r;

r = stylecow.Function.create('rgba(23,   24, 56,   .4)');
assert.strictEqual(r.toString(), 'rgba(23, 24, 56, .4)');

r = stylecow.Declaration.create('font-family: Arial');
assert.strictEqual(r.toString(), 'font-family: Arial;');

r = stylecow.Declaration.create('background-color: rgba(23, 24, 56, .4)');
assert.strictEqual(r.toString(), 'background-color: rgba(23, 24, 56, .4);');

r = stylecow.Declaration.create('width: calc(2 + 3)');
assert.strictEqual(r.search('Function', 'calc')[0].name, 'calc');

r = stylecow.Selector.create('div.ola');
assert.strictEqual(r.toString(), 'div.ola');

r = stylecow.Rule.create('div.ola {font-size: 3em;}');
assert.strictEqual(r.toString(), 'div.ola {\n\tfont-size: 3em;\n}');

r = stylecow.Rule.create('foo {font-size: calc(3em + (5px * 4px));}');
assert.strictEqual(r.toString(), 'foo {\n\tfont-size: calc(3em + (5px * 4px));\n}');

r = stylecow.Function.create('linear-gradient(rgba(23,   24, 56,   .4), #333)');
assert.strictEqual(r.toString(), 'linear-gradient(rgba(23, 24, 56, .4), #333)');

r = stylecow.Selector.create('div.ola');
assert.strictEqual(r.toString(), 'div.ola');
assert.strictEqual(r.length, 2);


r = stylecow.Keyword.create('.ola');
assert.strictEqual(r.toString(), '.ola');

r = stylecow.Function.create('::matches(div,p  )');
assert.strictEqual(r.toString(), '::matches(div, p)');

r = stylecow.Selector.create('div.ola::after');
assert.strictEqual(true, r.has('Keyword', '::after'));

r = stylecow.Rule.create('div.ola::after {color: blue;}');
assert.strictEqual(true, r.has('Keyword', '::after'));
assert.strictEqual(r, r.search('Keyword', '::after')[0].ancestor('Rule'));

var clone = r.search('Selector')[0].clone();
r.add(clone);
assert.strictEqual(r, clone.ancestor('Rule'));

r = stylecow.Rule.create('div.ola::after {color: blue; font-size: 2em;}');
assert.strictEqual(r.clone().toString(), r.toString());

r = stylecow.Value.create('1px 2px 3px rgba(0, 0, 0, 0.3)');
assert.strictEqual(r.toString(), '1px 2px 3px rgba(0, 0, 0, 0.3)');

r = stylecow.Declaration.create('box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3)');
assert.strictEqual(r.toString(), 'box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3);');

r = stylecow.Function.create('color(blue alpha(0.3))');
assert.strictEqual(r.toString(), 'color(blue alpha(0.3))');

r = stylecow.AtRule.create('@media (min-width: 500px) {color: blue;}');
assert.strictEqual(r.name, 'media');
assert.strictEqual(r.length, 2);
