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
	stylecow.tasks = [];
	stylecow.preparedTasks = {};
	stylecow.codeStyle = stylecow.config.codeStyles[stylecow.config.defaults.code];


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
			stylecow.tasks = stylecow.tasks.concat(task);
		} else {
			stylecow.tasks.push(task);
		}
	};


	//Set configuration
	stylecow.setConfig = function (config) {
		stylecow.tasks = [];

		config.plugins.forEach(function (name) {
			require(stylecow.pluginPrefix + name)(stylecow);
		});

		var prepared = {};

		stylecow.tasks.forEach(function (task) {
			if (stylecow.utils.needFix(config.support, task.disable)) {
				var name, val, k;

				stylecow.utils.forEach(task, function (val, name) {
					if (name === 'disable') {
						return;
					}

					if (val instanceof Function) {
						val = {'*': val};
					}

					if (!prepared[name]) {
						prepared[name] = {};
					}

					stylecow.utils.forEach(val, function (v, k) {
						if (!prepared[name][k]) {
							prepared[name][k] = [];
						}

						prepared[name][k].push(v);
					});
				});
			}
		});

		stylecow.preparedTasks = prepared;

		stylecow.codeStyle = stylecow.config.codeStyles[config.code];
	};


	//Convert a string
	stylecow.convert = function (code) {
		var css = stylecow.create(code);

		css.executePlugins(stylecow.preparedTasks);

		return css;
	};


	//Convert from a file
	stylecow.convertFromFile = function (file) {
		var css = stylecow.createFromFile(file);

		css.executePlugins(stylecow.preparedTasks);

		return css;
	};


})(require('./index'));
