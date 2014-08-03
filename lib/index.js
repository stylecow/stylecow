var css = require('./css');
var utils = require('./utils');
var fs = require('fs');

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

var Stylecow = function () {
	this.css = css;
	this.utils = utils;

	this.minSupport = {
		"explorer": 8.0,
		"firefox": 15.0,
		"chrome": 25.0,
		"safari": 5.0,
		"opera": 12.0,
		"android": 4.0,
		"ios": 5.0
	};
};

Stylecow.prototype = {
	getCodeStyle: function (name) {
		name = name || 'default';

		return codeStyles[name];
	},

	create: function (code) {
		return this.css.Root.create(code);
	},

	readFile: function (file) {
		return this.create(fs.readFileSync(file, 'utf8'));
	},

	installPlugin: function (name, success, error) {
		var self = this;
		var npm = require('npm');
		var packageName = 'stylecow-plugin-' + name;

		npm.load(function (err) {
			if (err) {
				error(err);
				return;
			}

			npm.commands.install([packageName], function (err, data) {
				if (err) {
					error(err);
					return;
				}

				success(data);
			});
		});
	},

	uninstallPlugin: function (name, success, error) {
		var self = this;
		var npm = require('npm');
		var packageName = 'stylecow-plugin-' + name;

		npm.load(function (err) {
			if (err) {
				error(err);
				return;
			}

			npm.commands.uninstall([packageName], function (err, data) {
				if (err) {
					error(err);
					return;
				}

				success(data);
			});
		});
	},

	listInstalledPlugins: function (success, error) {
		var npm = require('npm');
		
		npm.load(function (err) {
			if (err) {
				error(err);
				return;
			}

			var plugins = fs.readdirSync(npm.root).filter(function (value) {
				return value.slice(0, 16) === 'stylecow-plugin-';
			}).map(function (value) {
				return value.slice(16);
			});

			success(plugins);
		});
	},

	getPluginInfo: function (name, success, error) {
		var npm = require('npm');
		var packageName = 'stylecow-plugin-' + name;

		npm.load(function (err) {
			if (err) {
				error(err);
				return;
			}

			npm.commands.view([packageName], success);
		});
	},

	loadPlugins: function (success, error) {
		var self = this;
		var loadedPlugins = {};

		self.listInstalledPlugins(function (plugins) {
			plugins.forEach(function (name) {
				var execute = require('stylecow-plugin-' + name);

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

			success(loadedPlugins);
		}, error);
	}
};

module.exports = new Stylecow();
