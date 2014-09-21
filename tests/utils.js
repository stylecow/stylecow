var assert = require('assert');
var stylecow  = require('../lib');
var r;

r = stylecow.utils.explode(' ', 'one (two three) "four"');
assert.deepEqual(r, ['one', '(two three)', '"four"']);

r = stylecow.utils.explode(' ', 'one (two three) "four"', 2);
assert.deepEqual(r, ['one', '(two three) "four"']);

r = stylecow.utils.explode(' ', 'one (two \'three \"four"');
assert.deepEqual(r, ['one', '(two \'three \"four"']);

r = stylecow.utils.explodeTrim(';', 'one ; two; three;');
assert.deepEqual(r, ['one', 'two', 'three']);

r = stylecow.utils.explode('{', 'div.ola {font-size: 3em; a {color: blue;}}', 2);
assert.deepEqual(r, ['div.ola ', 'font-size: 3em; a {color: blue;}}']);

r = stylecow.utils.explodeTrim(',', 'one');
assert.deepEqual(r, ['one']);

r = stylecow.utils.parseSelector('div.ola:not(.active)>img');
assert.deepEqual(r, ['div', '.ola', ':not(.active)', '>', 'img']);

r = stylecow.utils.parseSelector(':not(.active)');
assert.deepEqual(r, [':not(.active)']);