(function (stylecow) {
	var fs = require('fs');

	//CSS elements
	require('./css/base');
	require('./css/comment');
	require('./css/charset');
	require('./css/import');
	require('./css/function');
	require('./css/root');
	require('./css/declaration');
	require('./css/keyframes');
	require('./css/keyword');
	require('./css/value');
	require('./css/rule');
	require('./css/selector');
	require('./css/argument');
	require('./css/namespace');
	require('./css/page');
	require('./css/fontface');
	require('./css/document');
	require('./css/media');
	require('./css/expression');
	require('./css/supports');
	require('./css/media');

	//Utils
	require('./error');
	require('./parser');
	require('./config');


	//Properties
	stylecow.pluginPrefix = 'stylecow-plugin-';
	stylecow.support = {};
	stylecow.tasks = {};
	stylecow.codeStyle = stylecow.codeStyles[stylecow.defaults.code];


	//Create from code string
	stylecow.create = function (code) {
		return stylecow.parse(code);
		//try {
		//} catch (error) {
		//	return error.getFirstError().toCode();
		//}
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
		stylecow.codeStyle = stylecow.codeStyles[config.code];
		stylecow.support = config.support;
		stylecow.tasks = {};

		config.plugins.forEach(function (name) {
			require(stylecow.pluginPrefix + name)(stylecow);
		});
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
