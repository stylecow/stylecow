var stylecow = require('../lib');

stylecow.setConfig({
	"support": {
		"explorer": 1,
		"firefox": 1,
		"chrome": 1,
		"safari": 1,
		"opera": 1,
		"android": 1,
		"ios": 1
	},
	"plugins": [
		"../../stylecow-plugin-color"
	],
	"code": "normal"
});

var code = stylecow.convertFromFile('styles.css');

console.log(code.toCode());
