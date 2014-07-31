var css = require('./css');
var config = require('./config');
var utils = require('./utils');
var fs = require('fs');

var plugins = {};
var pluginList = JSON.parse(fs.readFileSync(__dirname + '/installed_plugins.json', 'utf8'));

pluginList.forEach(function (name) {
	plugins[name] = require('stylecow-plugin-' + name);
});

var stylecow = {
	css: css,
	config: config,
	plugins: plugins,

	create: function (code) {
		return css.Root.create(code);
	},

	readFile: function (file) {
		return stylecow.create(fs.readFileSync(file, 'utf8'));
	},

	installPlugin: function (name) {
		var npm = require('npm');
		var packageName = 'stylecow-plugin-' + name;

		npm.load(function (er, npm) {
			npm.commands.installPlugin([packageName], function () {
				stylecow.plugins[name] = require(packageName);

				if (pluginList.indexOf(name) === -1) {
					pluginList.push(name);
					fs.writeFile(__dirname + '/installed_plugins.json', JSON.stringify(pluginList));
				}
			});
		});
	},

	removePlugin: function (name) {
		var npm = require('npm');
		var packageName = 'stylecow-plugin-' + name;

		npm.load(function (er, npm) {
			npm.commands.uninstallPlugin([packageName], function () {
				var index = pluginList.indexOf(name);

				if (index !== -1) {
					pluginList.splice(index, 1);
					fs.writeFile(__dirname + '/installed_plugins.json', JSON.stringify(pluginList));
				}
			});
		});
	}
};

module.exports = stylecow;
