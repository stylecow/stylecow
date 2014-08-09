var css = require('./css');
var utils = require('./utils');
var fs = require('fs');

var codeStyles = {
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
};

var Stylecow = function () {
	this.css = css;
	this.utils = utils;
	this.pluginPrefix = 'stylecow-plugin-';
};

Stylecow.prototype = {
	getCodeStyle: function (name) {
		return codeStyles[name];
	},

	getDefaults: function () {
		return {
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
			],
			code: this.getCodeStyle('normal')
		};
	},

	create: function (code) {
		return this.css.Root.create(code);
	},

	readFile: function (file) {
		return this.create(fs.readFileSync(file, 'utf8')).setData('sourceFile', file);
	},

	getPluginPackage: function (name) {
		if (name.indexOf(this.pluginPrefix) === 0) {
			return name;
		}

		return this.pluginPrefix + name;
	},

	getPluginName: function (name) {
		if (name.indexOf(this.pluginPrefix) === 0) {
			return name.substr(this.pluginPrefix.length);
		}

		return name;
	},

	getInstalledPlugins: function () {
		var node_modules = __dirname + '/../node_modules';

		return fs.readdirSync(node_modules).filter(function (value) {
			return value.slice(0, 16) === 'stylecow-plugin-';
		}).map(function (value) {
			return value.slice(16);
		});
	},

	loadPlugins: function (plugins, callback) {
		var self = this;
		var loadedPlugins = {};

		plugins.forEach(function (name) {
			var execute = require(self.getPluginPackage(name));

			if (execute instanceof Function) {
				execute = execute(self);
			}

			if (!(execute instanceof Array)) {
				execute = [execute];
			}

			loadedPlugins[name] = {
				enabled: true,
				execute: execute
			};
		});

		callback(loadedPlugins);
	}
};

module.exports = new Stylecow();
