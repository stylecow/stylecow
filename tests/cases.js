var assert = require('assert');
var stylecow = require('stylecow-core');

var test = new stylecow.Test(__dirname + '/cases');
var tasks = (new stylecow.Tasks())
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
	});


test.run(function (test) {
	tasks.run(test.css);

	describe('cases/' + test.name, function() {
		it('should match output.css', function() {
            //test.writeString()
            test.assertString();
        });

        it('should match ast.json', function() {
            //test.writeAst()
            test.assertAst();
        });
	});
});
