(function (stylecow) {
	var fs = require('fs');

	//CSS elements
	require('./css/base');
	require('./css/comment');
	require('./css/import');
	require('./css/function');
	require('./css/root');
	require('./css/declaration');
	require('./css/keyword');
	require('./css/value');
	require('./css/rule');
	require('./css/selector');
	require('./css/at-rule');

	//Utils
	require('./utils');
	require('./config');


	//Properties
	stylecow.pluginPrefix = 'stylecow-plugin-';


	//Create from code string
	stylecow.create = function (code) {
		return stylecow.Root.create(code);
	};


	//Read a file
	stylecow.readFile = function (file) {
		return stylecow.create(fs.readFileSync(file, 'utf8')).setData('sourceFile', file);
	};


	//Get default configuration
	stylecow.getDefaults = function () {
		return stylecow.config.defaults;
	};


	//Get a specific code style
	stylecow.getCodeStyle = function (name) {
		return stylecow.config.codeStyles[name];
	};


	//Get all locally installed plugins
	stylecow.getInstalledPlugins = function () {
		var node_modules = __dirname + '/../node_modules';
		var len = stylecow.pluginPrefix.length;

		return fs.readdirSync(node_modules).filter(function (value) {
			return value.slice(0, len) === stylecow.pluginPrefix;
		}).map(function (value) {
			return value.slice(len);
		}).sort();
	};


	//Get all available plugins from npm
	stylecow.getAllPlugins = function (callback) {
		loadNpm(function (npm) {
			var len = stylecow.pluginPrefix.length;

			//Hack to silence npm
			var log = console.log;
			console.log = function () {};

			npm.commands.search([stylecow.pluginPrefix], function (err, data) {
				//restore console.log
				console.log = log;

				if (!err) {
					var all = [];

					for (var i in data) {
						all.push({
							name: data[i].name.substr(len),
							description: data[i].description,
							version: data[i].version
						});
					}

					callback(all.sort());
				}
			});
		});
	};


	//Manage plugins (install, uninstall, update, etc)
	stylecow.managePlugins = function (action, plugins, callback) {
		loadNpm(function (npm) {
			var packages = plugins.map(function (plugin) {
				if (plugin[0] === '.') {
					return plugin;
				}

				return stylecow.pluginPrefix + plugin;
			});

			npm.commands[action](packages, function (err, data) {
				if (!err) {
					callback();
				}
			});
		});
	};

})(require('./index'));


//Private functions

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
