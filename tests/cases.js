var assert = require('assert');
var stylecow = require('../lib');

stylecow
	.loadPlugin('calc')
	.loadPlugin('color')
	.loadPlugin('custom-media')
	.loadPlugin('custom-selector')
	.loadPlugin('extend')
	.loadPlugin('fixes')
	.loadPlugin('flex')
	.loadPlugin('import')
	.loadPlugin('matches')
	.loadPlugin('msfilter-background-alpha')
	.loadPlugin('msfilter-linear-gradient')
	.loadPlugin('msfilter-transform')
	.loadPlugin('nested-rules')
	.loadPlugin('prefixes')
	.loadPlugin('rem')
	.loadPlugin('variables')
	.minSupport({
		"explorer": 0,
		"firefox": 0,
		"chrome": 0,
		"safari": 0,
		"opera": 0,
		"android": 0,
		"ios": 0
	})
	.testCases(__dirname + '/cases', function (test) {
		stylecow.run(test.css);

		describe('cases/' + test.name, function() {
			it('should match output.css', function() {
				//test.write('output.css', test.css.toString());
				assert.equal(test.css.toString(), test.read('output.css'));
			});

			it('should match ast.json', function() {
				//test.writeJson('ast.json', test.css.toAst());
				assert.deepEqual(test.css.toAst(), test.readJson('ast.json'));
			});
		});
	});
