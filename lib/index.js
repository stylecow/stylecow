(function (stylecow) {
	var fs = require('fs');
	var path = require('path');


	//CSS elements
	require('./css/base');
	require('./css/argument');
	require('./css/atrule');
	require('./css/comment');
	require('./css/condition');
	require('./css/declaration');
	require('./css/function');
	require('./css/keyword');
	require('./css/nested-atrule');
	require('./css/selector');
	require('./css/root');
	require('./css/rule');
	require('./css/value');


	//Utils
	require('./error');
	require('./code');
	require('./parser');


	//Properties
	stylecow.pluginPrefix = 'stylecow-plugin-';
	stylecow.support = {};
	stylecow.tasks = {};


	//Change the current directory
	var cwd = process.cwd();

	stylecow.cwd = function (newCwd) {
		if (newCwd === undefined) {
			return cwd;
		}
		cwd = newCwd;
	};


	//Default config
	stylecow.defaults = {
		support: {
			"explorer": 8.0,
			"firefox": 30.0,
			"chrome": 35.0,
			"safari": 6.0,
			"opera": 22.0,
			"android": 4.0,
			"ios": 6.0
		},
		plugins: []
	};


	//Create from code string
	stylecow.create = function (code) {
		return stylecow.parse(code);
	};


	//Read a css file
	stylecow.createFromFile = function (file) {
		var fullfile = path.resolve(stylecow.cwd(), file);

		if (!fs.existsSync(fullfile)) {
			console.error('error: Input file `' + fullfile + '` not found');
			return false;
		}

		return stylecow.create(fs.readFileSync(fullfile, 'utf8')).setData('sourceFile', file);
	};

	//Merges two css files
	stylecow.merge = function (to, from) {
		var sourceFile = from.getData('sourceFile');

		from.children().forEach(function (child) {
			child.setData('sourceFile', sourceFile);
			to.push(child);
		});
	};


	//Register new tasks
	stylecow.addTask = function (task) {
		if (task instanceof Array) {
			return task.forEach(stylecow.addTask);
		}

		if (needFix(stylecow.support, task.disable)) {
			var name, val, k;

			for (name in task) {
				if (name === 'disable') {
					continue;
				}

				if (task.hasOwnProperty(name)) {
					val = task[name];

					if (val instanceof Function) {
						val = {'*': val};
					}

					if (!stylecow.tasks[name]) {
						stylecow.tasks[name] = {};
					}

					for (k in val) {
						if (val.hasOwnProperty(k)) {
							if (!stylecow.tasks[name][k]) {
								stylecow.tasks[name][k] = [];
							}

							stylecow.tasks[name][k].push(val[k]);
						}
					}
				}
			}
		}
	};


	//Set configuration
	stylecow.setConfig = function (config) {
		stylecow.support = config.support;
		stylecow.tasks = {};

		if (config.plugins) {
			config.plugins.forEach(function (name) {
				if (name[0] === '.' || name[0] === '/') {
					require(name)(stylecow);
				} else {
					require(stylecow.pluginPrefix + name)(stylecow);
				}
			});
		}
	};


	//Convert a string
	stylecow.convert = function (code) {
		var css = stylecow.create(code);

		css.executeTasks(stylecow.tasks);

		return css;
	};


	//Convert from a file
	stylecow.convertFromFile = function (file) {
		var css = stylecow.createFromFile(file);

		css.executeTasks(stylecow.tasks);

		return css;
	};


	function needFix (minSupport, disablePlugin) {
		if (!disablePlugin || !minSupport) {
			return true;
		}

		for (var browser in disablePlugin) {
			if (minSupport[browser] === false) {
				continue;
			}

			if (disablePlugin[browser] === false || minSupport[browser] < disablePlugin[browser]) {
				return true;
			}
		}

		return false;
	}

})(require('./index'));
