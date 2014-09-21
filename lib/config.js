(function (stylecow) {
	stylecow.config = {
		codeStyles: {
			"normal": {
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
		},

		defaults: {
			code: "normal",
			support: {
				"explorer": 8.0,
				"firefox": 15.0,
				"chrome": 25.0,
				"safari": 5.0,
				"opera": 12.0,
				"android": 4.0,
				"ios": 5.0
			},
			plugins: [
				"color",
				"animation",
				"appearance",
				"background",
				"border",
				"box-shadow",
				"box-sizing",
				"calc",
				"clip",
				"color",
				"column",
				"cursor",
				"document",
				"flex",
				"float",
				"fullscreen",
				"grid",
				"initial",
				"inline-block",
				"linear-gradient",
				"mask",
				"matches",
				"min-height",
				"nested-rules",
				"object",
				"opacity",
				"pseudoelements",
				"region",
				"rem",
				"sizing",
				"sticky",
				"transform",
				"transition",
				"type",
				"user-select",
				"variables",
				"vmin"
			]
		}
	};

})(require('./index'));
