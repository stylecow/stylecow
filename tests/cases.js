var assert = require('assert');
var stylecow = require('stylecow-core');

stylecow
	.loadNpmModule('stylecow-plugin-calc')
	.loadNpmModule('stylecow-plugin-color')
	.loadNpmModule('stylecow-plugin-custom-media')
	.loadNpmModule('stylecow-plugin-custom-selector')
	.loadNpmModule('stylecow-plugin-extend')
	.loadNpmModule('stylecow-plugin-fixes')
	.loadNpmModule('stylecow-plugin-flex')
	.loadNpmModule('stylecow-plugin-import')
	.loadNpmModule('stylecow-plugin-matches')
	.loadNpmModule('stylecow-plugin-msfilter-background-alpha')
	.loadNpmModule('stylecow-plugin-msfilter-linear-gradient')
	.loadNpmModule('stylecow-plugin-msfilter-transform')
	.loadNpmModule('stylecow-plugin-nested-rules')
	.loadNpmModule('stylecow-plugin-prefixes')
	.loadNpmModule('stylecow-plugin-rem')
	.loadNpmModule('stylecow-plugin-variables')
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
