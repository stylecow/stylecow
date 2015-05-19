var stylecow = require('stylecow-parser');

module.exports = stylecow;

//Utils used by some plugins
require('./utils');

//Properties
stylecow.tasks = [];
stylecow.support = {
	explorer: false,
	firefox: false,
	chrome: false,
	safari: false,
	opera: false,
	android: false,
	ios: false
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
	if (typeof support === 'string') {
		stylecow.support = getSupportFromBrowserlist(support);
	} else {
		stylecow.support = support;
	}

	return stylecow;
};


//Run registered tasks
stylecow.run = function (css) {
	var tasks = {_: []};

	for (var i = stylecow.tasks.length - 1; i >= 0; i--) {
		var task = stylecow.tasks[i];

		if (task.forBrowsersLowerThan && !needFix(stylecow.support, task.forBrowsersLowerThan)) {
			continue;
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
	};

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

		while (k in element) {
			if (element[k].data.executed) {
				++k;
				continue;
			}

			executeTasks(element[k], tasks);
			k = 0;
		}
	}
	
	if (tasks._.length) {
		for (var i = tasks._.length - 1; i >= 0 && element.parent; i--) {
			if (element.is(tasks[i].filter)) {
				tasks[i].fn(element);
			}
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

function getSupportFromBrowserlist (query) {
	var browsersList = require('browserslist');
	var browsers = {
		ie: 'explorer',
		firefox: 'firefox',
		chrome: 'chrome',
		safari: 'safari',
		opera: 'opera',
		ios_saf: 'ios',
		android: 'android'
	};
	var support = {
		explorer: false,
		firefox: false,
		chrome: false,
		safari: false,
		opera: false,
		android: false,
		ios: false
	};

	browsersList(query).forEach(function (val) {
		val = val.split(' ', 2);

		var name = browsers[val[0]];

		if (!name) {
			return;
		}

		var value = val[1].split('-')[0];

		if (value) {
			support[name] = parseFloat(value);
		}
	});

	return support;
}
