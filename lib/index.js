var stylecow = require('stylecow-parser');

module.exports = stylecow;

//Utils used by some plugins
require('./utils');

//Properties
stylecow.tasks = [];
stylecow.support = {
	"explorer": 8.0,
	"firefox": 30.0,
	"chrome": 35.0,
	"safari": 6.0,
	"opera": 22.0,
	"android": 4.0,
	"ios": 6.0
};

//Load npm modules
stylecow.loadNpmModule = function (name) {
	require(name)(stylecow);

	return stylecow;
};

//Load stylecow plugin
stylecow.loadPlugin = function (name) {
	stylecow.loadNpmModule('stylecow-plugin-' + name);

	return stylecow;
};

//Set temporary default browser support
var defaultSupport;

stylecow.forBrowsersLowerThan = function (support, callback) {
	var prevSupport = defaultSupport;

	defaultSupport = support;
	callback(stylecow);
	defaultSupport = prevSupport;

	return stylecow;
};

//Register new tasks
stylecow.addTask = function (task) {
	if (!task.forBrowsersLowerThan) {
		task.forBrowsersLowerThan = defaultSupport;
	}

	stylecow.tasks.push(task);

	return stylecow;
};

//Configure minimum support
stylecow.minSupport = function (support) {
	stylecow.support = support;

	return stylecow;
};


//Run registered tasks
stylecow.run = function (css) {
	var tasks = {_: []};

	stylecow.tasks.forEach(function (task) {
		if (task.forBrowsersLowerThan && !needFix(stylecow.support, task.forBrowsersLowerThan)) {
			return;
		}

		if (task.filter) {
			if (typeof task.filter.type === 'string') {
				if (task.filter.type in tasks) {
					tasks[task.filter.type].push(task);
				} else {
					tasks[task.filter.type] = [task];
				}
			} else {
				tasks._.push(task);
			}
		} else {
			task.fn(css);
		}
	});

	executeTasks(css, tasks);

	if ('Root' in tasks) {
		for (var i = tasks.Root.length - 1; i >= 0; i--) {
			if (css.is(tasks.Root[i].filter)) {
				tasks.Root[i].fn(css);
			}
		}
	}
};

function executeTasks (element, tasks) {
	if (element instanceof Array) {
		var k = 0;

		while (element[k]) {
			var child = element[k];

			if (child.data.executed) {
				++k;
				continue;
			}

			executeTasks(child, tasks);
			k = 0;
		}
	}

	for (var i = tasks._.length - 1; i >= 0 && element.parent; i--) {
		if (element.is(tasks[i].filter)) {
			tasks[i].fn(element);
		}
	}

	if (element.type in tasks) {
		for (var i = tasks[element.type].length - 1; i >= 0 && element.parent; i--) {
			if (element.is(tasks[element.type][i].filter)) {
				tasks[element.type][i].fn(element);
			}
		}
	}

	element.data.executed = true;
}

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
