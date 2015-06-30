var assert = require('assert');
var stylecow = require('stylecow-core');

stylecow
	.use(require('stylecow-plugin-calc'))
	.use(require('stylecow-plugin-color'))
	.use(require('stylecow-plugin-custom-media'))
	.use(require('stylecow-plugin-custom-selector'))
	.use(require('stylecow-plugin-extend'))
	.use(require('stylecow-plugin-fixes'))
	.use(require('stylecow-plugin-flex'))
	.use(require('stylecow-plugin-import'))
	.use(require('stylecow-plugin-matches'))
	.use(require('stylecow-plugin-msfilter-background-alpha'))
	.use(require('stylecow-plugin-msfilter-linear-gradient'))
	.use(require('stylecow-plugin-msfilter-transform'))
	.use(require('stylecow-plugin-nested-rules'))
	.use(require('stylecow-plugin-prefixes'))
	.use(require('stylecow-plugin-rem'))
	.use(require('stylecow-plugin-variables'))
	.use(require('stylecow-plugin-webkit-gradient'))
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
