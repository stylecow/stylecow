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

function loadNpm (callback) {
	var npm = require('npm');
	var path = require('path');

	npm.load({
		prefix: path.dirname(__dirname)
	}, function (err) {
		if (err) {
			return console.error(err);
		}

		callback(npm);
	});
}

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
		var len = this.pluginPrefix.length;
		var self = this;

		return fs.readdirSync(node_modules).filter(function (value) {
			return value.slice(0, len) === self.pluginPrefix;
		}).map(function (value) {
			return value.slice(len);
		}).sort();
	},

	getAllPlugins: function (callback) {
		var self = this;

		loadNpm(function (npm) {
			//Hack to silence npm
			var log = console.log;
			console.log = function () {};

			npm.commands.search([self.pluginPrefix], function (err, data) {
				//restore console.log
				console.log = log;

				if (!err) {
					var all = [];

					for (var i in data) {
						all.push({
							name: self.getPluginName(data[i].name),
							description: data[i].description,
							version: data[i].version
						});
					}

					callback(all.sort());
				}
			});
		});
	},

	managePlugins: function (action, plugins, callback) {
		var self = this;

		loadNpm(function (npm) {
			var packages = plugins.map(function (plugin) {
				if (plugin[0] === '.') {
					return plugin;
				}

				return self.getPluginPackage(plugin);
			});

			npm.commands[action](packages, function (err, data) {
				if (!err) {
					callback();
				}
			});
		});
	},

	preparePlugins: function (plugins) {
		return plugins.map(this.preparePlugin, this);
	},

	preparePlugin: function (plugin) {
		if (typeof plugin === 'string') {
			plugin = require(this.getPluginPackage(plugin));
		}

		if (plugin instanceof Function) {
			plugin = plugin(this);
		}

		if (!(plugin instanceof Array)) {
			return [plugin];
		}

		return plugin;
	}
};

module.exports = new Stylecow();

