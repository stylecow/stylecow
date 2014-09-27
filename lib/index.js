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
	stylecow.support = {};
	stylecow.tasks = {};
	stylecow.codeStyle = stylecow.codeStyles[stylecow.defaults.code];


	//Create from code string
	stylecow.create = function (code) {
		return stylecow.Root.create(code);
	};


	//Read a css file
	stylecow.createFromFile = function (file) {
		return stylecow.create(fs.readFileSync(file, 'utf8')).setData('sourceFile', file);
	};


	//Register new tasks
	stylecow.addTask = function (task) {
		if (task instanceof Array) {
			return task.forEach(stylecow.addTask);
		}

		if (stylecow.utils.needFix(stylecow.support, task.disable)) {
			var name, val, k;

			stylecow.utils.forEach(task, function (val, name) {
				if (name === 'disable') {
					return;
				}

				if (val instanceof Function) {
					val = {'*': val};
				}

				if (!stylecow.tasks[name]) {
					stylecow.tasks[name] = {};
				}

				stylecow.utils.forEach(val, function (v, k) {
					if (!stylecow.tasks[name][k]) {
						stylecow.tasks[name][k] = [];
					}

					stylecow.tasks[name][k].push(v);
				});
			});
		}
	};


	//Set configuration
	stylecow.setConfig = function (config) {
		stylecow.tasks = {};

		config.plugins.forEach(function (name) {
			require(stylecow.pluginPrefix + name)(stylecow);
		});

		stylecow.support = config.support;
		stylecow.codeStyle = stylecow.codeStyles[config.code];
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


})(require('./index'));
