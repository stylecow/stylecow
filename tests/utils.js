var assert = require('assert');
var utils  = require('../lib/utils');

var r;

r = utils.explode(' ', 'one (two three) "four"');
assert.deepEqual(r, ['one', '(two three)', '"four"']);

r = utils.explode(' ', 'one (two three) "four"', 2);
assert.deepEqual(r, ['one', '(two three) "four"']);

r = utils.explode(' ', 'one (two \'three \"four"');
assert.deepEqual(r, ['one', '(two \'three \"four"']);

r = utils.explodeTrim(';', 'one ; two; three;');
assert.deepEqual(r, ['one', 'two', 'three']);

r = utils.explode('{', 'div.ola {font-size: 3em; a {color: blue;}}', 2);
assert.deepEqual(r, ['div.ola ', 'font-size: 3em; a {color: blue;}}']);

r = utils.explodeTrim(',', 'one');
assert.deepEqual(r, ['one']);

r = utils.parseSelector('div.ola:not(.active)>img');
assert.deepEqual(r, ['div', '.ola', ':not(.active)', '>', 'img']);

r = utils.parseSelector(':not(.active)');
assert.deepEqual(r, [':not(.active)']);