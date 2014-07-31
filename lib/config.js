var support = {
	"explorer": 8.0,
	"firefox": 15.0,
	"chrome": 25.0,
	"safari": 5.0,
	"opera": 12.0,
	"android": 4.0,
	"ios": 5.0
};

var codeStyles = {
	"default": {
		"indent": "\t",
		"linebreak": "\n",
		"selectorJoiner": ", ",
		"argumentJoiner": ", ",
		"valueJoiner": ", ",
		"ruleColon": ": ",
		"ruleEnd": ";",
		"comments": "all", // (all|important|none)
		"commentStart": "/* ",
		"commentEnd": " */",
		"rulesetStart": " {\n",
		"rulesetEnd": "\n}"
	},
	"minify": {
		"indent": "",
		"linebreak": "",
		"selectorJoiner": ",",
		"argumentJoiner": ",",
		"valueJoiner": ",",
		"ruleColon": ":",
		"ruleEnd": ";",
		"comments": "none",
		"commentStart": "/*",
		"commentEnd": "*/",
		"rulesetStart": "{",
		"rulesetEnd": "}"
	}
};

var i;

var defaults = {}

for (i in support) {
	defaults[i] = support[i];
}

for (i in codeStyles['default']) {
	defaults[i] = codeStyles['default'][i];
}

module.exports = {
	support: support,
	codeStyles: codeStyles,
	defaults: defaults,

	setSetting: function (element, name, value) {
		switch (name) {
			case 'enable':
			case 'disable':
				if (typeof value === 'string') {
					value = value.split(',');
				}

				value.forEach(function (k) {
					element.setData(k, (name === 'enable'));
				});
				break;

			case 'explorer':
			case 'firefox':
			case 'chrome':
			case 'safari':
			case 'opera':
			case 'android':
			case 'ios':
				if (typeof value === 'boolean') {
					element.setData(name, value);
				} else if (value === 'true') {
					element.setData(name, true);
				} else if (!value || value === 'false') {
					element.setData(name, false);
				} else {
					element.setData(name, parseFloat(value, 10));
				}
				break;

			case 'code':
				if (typeof value === 'string') {
					value = codeStyles[value];
				}

				for (var k in value) {
					element.setData(k, value[k]);
				}
				break;
		}
	}
};