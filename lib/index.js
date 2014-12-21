(function (stylecow) {
	var fs = require('fs');
	var path = require('path');

	//CSS elements
	require('./css/base');
	
	require('./css/root');
	require('./css/rule');
	require('./css/block');
	require('./css/declaration');
	require('./css/function');
	require('./css/value');
	require('./css/keyword');
	require('./css/string');
	require('./css/expression');
	require('./css/comment');
	require('./css/selectors');
	require('./css/selector');
	require('./css/combinator');
	require('./css/element');
	require('./css/media-queries');
	require('./css/media-query');
	require('./css/atrule');

	require('./reader');
	require('./coder');

	require('./utils');
	require('./error');


	//Tasks
	stylecow.tasks = [];


	//Change the current directory
	var cwd = process.cwd();

	stylecow.cwd = function (newCwd) {
		if (newCwd === undefined) {
			return cwd;
		}
		cwd = newCwd;
	};

	stylecow.run = function (css, config) {
		var tasks = {
			before: [],
			after: []
		};

		stylecow.tasks.forEach(function (task) {
			if (task.forBrowsersLowerThan && !needFix(config.support, task.forBrowsersLowerThan)) {
				return;
			}

			if (task.executeBefore === true) {
				tasks.before.push(task);
			} else {
				tasks.after.push(task);
			}
		});

		css.executeTasks(tasks);
	};


	//Set temporary default browser support
	var defaultSupport;

	stylecow.forBrowsersLowerThan = function (support, callback) {
		var prevSupport = stylecow.support;

		defaultSupport = support;
		callback(stylecow);
		defaultSupport = prevSupport;
	};

	//Register new tasks
	stylecow.addTask = function (task) {
		if (!task.forBrowsersLowerThan) {
			task.forBrowsersLowerThan = defaultSupport;
		}

		stylecow.tasks.push(task);
	};

	//Remove all tasks
	stylecow.cleanTasks = function () {
		stylecow.tasks = [];
	};


	//Load npm modules
	stylecow.loadNpmModule = function (name) {
		require(name)(stylecow);
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
