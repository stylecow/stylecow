require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./browser":[function(require,module,exports){
// browserify browser.js -o b.js -r ./browser.js

var stylecow = require('../../lib');

module.exports = stylecow;

},{"../../lib":16}],1:[function(require,module,exports){
(function (stylecow) {
	stylecow.codeStyles = {
		"normal": {
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

	stylecow.defaults = {
		code: "normal",
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

})(require('./index'));

},{"./index":16}],2:[function(require,module,exports){
(function (stylecow) {

	stylecow.Argument = function () {
		this.type = 'Argument';
	};

	stylecow.Argument.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this.join(' ');
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../index'));

},{"../index":16}],3:[function(require,module,exports){
(function (stylecow) {

	stylecow.AtRule = function (name) {
		this.type = 'AtRule';
		this.name = name;
	};

	stylecow.AtRule.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				var vendor = name.match(/^@\-(\w+)\-/);
				this.vendor = vendor ? vendor[0] : null;
				this._name = name;
			}
		},

		toString: {
			value: function () {
				return this.name + ' ' + this.join(' ') + ';';
			}
		},

		toCode: {
			value: function () {
				var value = this.map(function (child) {
					return child.toCode();
				}).join(stylecow.codeStyle.valueJoiner);

				return this.name + ' ' + stylecow.codeStyle.ruleColon + value + stylecow.codeStyle.ruleEnd;
			}
		}
	});

})(require('../index'));

},{"../index":16}],4:[function(require,module,exports){
(function (stylecow) {

	stylecow.Base = Object.create(Array.prototype, {
		executeTasks: {
			value: function (tasks, vendor) {
				if (vendor) {
					if (this.vendor && this.vendor !== vendor) {
						return this.remove();
					}
				} else {
					vendor = this.vendor;
				}

				executeTasks(tasks[this.type + 'Before'], this);

				var k = 0;

				while (this[k]) {
					var child = this[k];

					if (child.executed) {
						++k;
						continue;
					}

					child.executeTasks(tasks, vendor);

					k = 0;
				}

				executeTasks(tasks[this.type], this);

				this.executed = true;
			}
		},

		clone: {
			value: function () {
				var clone = new stylecow[type](this.name);

				this.forEach(function (child) {
					var childClone = child.clone();
					childClone.parent = clone;

					clone.push(childClone);
				});
				
				return clone;
			}
		},

		cloneBefore: {
			value: function () {
				var clone = this.clone();
				this.insertBefore(clone);

				return clone;
			}
		},

		cloneAfter: {
			value: function () {
				var clone = this.clone();
				this.insertAfter(clone);

				return clone;
			}
		},

		is: {
			value: function (type, match) {
				if (type && !equals(this.type, type)) {
					return false;
				}

				if (!match) {
					return true;
				}

				if (typeof match === 'string') {
					return this.toString() === match;
				}

				if (match instanceof Array) {
					return match.indexOf(this.toString()) !== -1;
				}

				if (match.name && !equals(this.name, match.name)) {
					return false;
				}

				if (match.value && !equals(this.value, match.value)) {
					return false;
				}

				if (match.vendor && !equals(this.vendor, match.vendor)) {
					return false;
				}

				return true;
			}
		},

		children: {
			value: function (type, match) {
				return this.filter(function (child) {
					return child.is(type, match);
				});
			}
		},

		hasChild: {
			value: function (type, match) {
				return this.some(function (child) {
					return child.is(type, match);
				});
			}
		},

		search: {
			value: function (type, match, result) {
				result = result || [];

				if (this.is(type, match)) {
					result.push(this);
				}

				for (var i = 0, t = this.length; i < t; i++) {
					this[i].search(type, match, result);
				}

				return result;
			}
		},

		has: {
			value: function (type, match) {
				if (this.is(type, match)) {
					return true;
				}

				for (var i = 0, t = this.length; i < t; i++) {
					if (this[i].has(type, match)) {
						return true;
					}
				}

				return false;
			}
		},

		ancestor: {
			value: function (type, match) {
				if (this.is(type, match)) {
					return this;
				}

				if (this.parent) {
					return this.parent.ancestor(type, match);
				}
			}
		},

		setContent: {
			value: function (value) {
				this.splice(0);

				if (value instanceof Array) {
					value.forEach(function (v) {
						stylecow.parse(v, this);
					}, this);
				} else {
					stylecow.parse(value, this);
				}

				return this;
			}
		},

		getContent: {
			value: function () {
				return this.map(function (child) {
					return child.toString();
				});
			}
		},

		getData: {
			value: function (key) {
				if (this._data && (key in this._data)) {
					return this._data[key];
				}

				if (this.parent) {
					return this.parent.getData(key);
				}
			}
		},

		setData: {
			value: function (key, value) {
				if (!this._data) {
					this._data = {};
				}

				this._data[key] = value;

				return this;
			}
		},

		files: {
			get: function () {
				var files = {};

				this.search()
					.filter(function (child) {
						return (child._data && child._data['sourceFile']);
					})
					.map(function (child) {
						return child._data['sourceFile'];
					})
					.forEach(function (file) {
						files[file] = null;
					});

				return Object.getOwnPropertyNames(files);
			}
		},

		index: {
			value: function () {
				if (this.parent) {
					return this.parent.indexOf(this);
				}

				return -1;
			}
		},

		add: {
			value: function (child, index, after) {
				child.detach();
				child.parent = this;

				if (index === undefined || (after && index === this.length)) {
					this.push(child);
				} else {
					this.splice(after ? index + 1 : index, 0, child);
				}

				return child;
			}
		},

		next: {
			value: function () {
				var index = this.index();

				if (index !== -1) {
					return this.parent[index + 1];
				}
			}
		},

		prev: {
			value: function () {
				var index = this.index();

				if (index > 0) {
					return this.parent[index - 1];
				}
			}
		},

		append: {
			value: function (child) {
				return this.add(child);
			}
		},

		prepend: {
			value: function (child) {
				return this.add(child, 0);
			}
		},

		insertBefore: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					this.parent.add(child, index);
				}

				return this;
			}
		},

		insertAfter: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					this.parent.add(child, index, true);
				}

				return this;
			}
		},

		replaceWith: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					var parent = this.parent;
					this.remove();

					parent.add(child, index);
				}

				return this;
			}
		},

		remove: {
			value: function (propagate) {
				if (!propagate) {
					this.detach();
				}

				this.forEach(function (child) {
					child.remove(true);
				});

				this.parent = null;
				this.splice(0);

				return this;
			}
		},

		detach: {
			value: function () {
				var index = this.index();

				if (index !== -1) {
					this.parent.splice(index, 1);
					this.parent = null;
				}

				return this;
			}
		},

		toCode: {
			value: function () {
				return this.toString();
			}
		}
	});

	function equals (value, needle) {
		if (needle === true) {
			return value ? true : false;
		}

		if (typeof needle === 'string') {
			return (needle === value);
		}

		if (needle instanceof Array) {
			return (needle.indexOf(value) !== -1);
		}

		if (needle instanceof RegExp) {
			return needle.test(value);
		}

		return true;
	}

	function executeTasks (tasks, element) {
		if (!tasks) {
			return;
		}

		for (var name in tasks) {
			if (tasks.hasOwnProperty(name)) {
				if ((name === '*') || (name === element.name)) {
					tasks[name].forEach(function (fn) {
						fn(element);
					});
				}
			}
		}
	}

})(require('../index'));

},{"../index":16}],5:[function(require,module,exports){
(function (stylecow) {

	stylecow.Comment = function (name) {
		this.type = 'Comment';
		this.name = name;
	};

	stylecow.Comment.prototype = Object.create(stylecow.Base, {
		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				this.important = (name.trim()[0] === '!');
				this._name = name;
			}
		},

		toString: {
			value: function () {
				return '/* ' + this._name + ' */';
			}
		},

		toCode: {
			value: function () {
				if (!this._name || stylecow.codeStyle.comments === 'none' || (stylecow.codeStyle.comments === 'important' && !this.important)) {
					return '';
				}

				return stylecow.codeStyle.commentStart + this._name + stylecow.codeStyle.commentEnd;
			}
		}
	});
})(require('../index'));

},{"../index":16}],6:[function(require,module,exports){
(function (stylecow) {

	stylecow.Condition = function (name) {
		this.type = 'Condition';
		this.name = name;
	};

	stylecow.Condition.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../index'));

},{"../index":16}],7:[function(require,module,exports){
(function (stylecow) {

	stylecow.Declaration = function (name) {
		this.type = 'Declaration';
		this.name = name;
	};

	stylecow.Declaration.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				if (name[0] === '*' || name[0] === '_') {
					this.vendor = 'ms';
				} else if (name[0] === '-') {
					var vendor = name.match(/^\-(\w+)\-/);
					this.vendor = vendor ? vendor[0] : null;
				} else {
					this.vendor = null;
				}

				this._name = name;
			}
		},

		value: {
			get: function () {
				return this.join(', ');
			}
		},

		toString: {
			value: function () {
				return this.name + ': ' + this.value + ';';
			}
		},

		toCode: {
			value: function () {
				var value = this.map(function (child) {
					return child.toCode();
				}).join(stylecow.codeStyle.valueJoiner);

				if (this.name === '-ms-filter') {
					value = "'" + value + "'";
				}

				return this.name + stylecow.codeStyle.ruleColon + value + stylecow.codeStyle.ruleEnd;
			}
		}
	});
})(require('../index'));

},{"../index":16}],8:[function(require,module,exports){
(function (stylecow) {

	stylecow.Function = function (name) {
		this.type = 'Function';
		this.name = name;
	};

	stylecow.Function.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				var vendor = name.match(/^([:]+)?\-(\w+)\-/);
				this.vendor = vendor ? vendor[0] : null;
				this._name = name;
			}
		},

		toString: {
			value: function () {
				return this.name + '(' + this.join(', ') + ')';
			}
		},

		toCode: {
			value: function () {
				return this.name + '(' + this.map(function (child) {
					return child.toCode();
				}).join(stylecow.codeStyle.argumentJoiner) + ')';
			}
		}
	});
})(require('../index'));

},{"../index":16}],9:[function(require,module,exports){
(function (stylecow) {

	stylecow.Keyword = function (name) {
		this.type = 'Keyword';
		this.name = name;
	};

	stylecow.Keyword.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				this.vendor = null;
				this.quoted = false;

				if (name[0] === '"' || name[0] === "'") {
					this.quoted = true;
					name = name.slice(1, -1);
				} else if (name[0] === '-') {
					var vendor = name.match(/^\-(\w+)\-/);
					this.vendor = vendor ? vendor[0] : null;
				}

				this._name = name;
			}
		},

		toString: {
			value: function () {
				return this.quoted ? ('"' + this.name + '"') : this.name;
			}
		}
	});
})(require('../index'));

},{"../index":16}],10:[function(require,module,exports){
(function (stylecow) {

	stylecow.NestedAtRule = function (name) {
		this.type = 'NestedAtRule';
		this.name = name;
	};

	stylecow.NestedAtRule.prototype = Object.create(stylecow.AtRule.prototype, {

		toString: {
			value: function () {
				var stringIn = [];
				var stringOut = [];
				var conditions = [];
				var selectors = [];

				this.forEach(function (child) {
					var string = child.toString();

					if (string) {
						if (child.is('Selector')) {
							selectors.push(child);
						} else if (child.is('Condition')) {
							conditions.push(child);
						} else if (child.is('Value')) {
							stringOut.push(child);
						} else {
							stringIn.push(child);
						}
					}
				});

				if (selectors.length) {
					stringOut.push(selectors.join(', '));
				}

				if (conditions.length) {
					stringOut.push(conditions.join(' '));
				}

				stringOut = stringOut.join(' ');

				if (stringOut) {
					stringOut += ' ';
				}

				stringIn = "\t" + stringIn.join("\n").replace(/\n/g, '\n' + "\t");

				return this.name + ' ' + stringOut + "{\n" + stringIn + "\n}";
			}
		},

		toCode: {
			value: function () {
				var stringIn = [];
				var stringOut = [];

				this.forEach(function (child) {
					var string = child.toCode();

					if (string) {
						if (child.is('Condition')) {
							stringOut.push(string);
						} else {
							stringIn.push(string);
						}
					}
				});

				if (!stringIn.length) {
					return '';
				}

				stringOut = arrayUnique(stringOut);
				stringIn = arrayUnique(stringIn).join(stylecow.codeStyle.linebreak);

				if (stylecow.codeStyle.indent) {
					stringIn = stylecow.codeStyle.indent + stringIn.replace(/\n/g, '\n' + stylecow.codeStyle.indent);
				}

				return this.name + ' ' + stringOut.join(stylecow.codeStyle.selectorJoiner) + stylecow.codeStyle.rulesetStart + stringIn + stylecow.codeStyle.rulesetEnd;
			}
		}
	});

	function arrayUnique (array) {
		var i, k, a = [];

		for (i = array.length - 1; i >= 0; i--) {
			k = a.indexOf(array[i]);

			if (k === -1) {
				a.unshift(array[i]);
			}
		}

		return a;
	}

})(require('../index'));

},{"../index":16}],11:[function(require,module,exports){
(function (stylecow) {

	stylecow.Root = function () {
		this.type = 'Root';
	};

	stylecow.Root.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				return this.map(function (child) {
					return child.toString();
				}).filter(function (string) {
					return string ? true : false;
				}).join("\n");
			}
		},

		toCode: {
			value: function () {
				return this.map(function (child) {
					return child.toCode();
				}).filter(function (string) {
					return string ? true : false;
				}).join(stylecow.codeStyle.linebreak);
			}
		}
	});
})(require('../index'));

},{"../index":16}],12:[function(require,module,exports){
(function (stylecow) {

	stylecow.Rule = function () {
		this.type = 'Rule';
	};

	stylecow.Rule.prototype = Object.create(stylecow.Root.prototype, {

		addOldMsFilter: {
			value: function (filter) {
				var declaration = this.children('Declaration', '-ms-filter').pop();

				if (declaration) {
					if (declaration.value === 'none') {
						declaration.value = filter;
					} else if (declaration.content.indexOf(filter) === -1) {
						declaration.append(filter);
					}
				} else {
					declaration = this.add(stylecow.Declaration.create('-ms-filter:' + filter));
				}
			}
		},

		toString: {
			value: function () {
				var declarations = [];
				var selectors = [];

				this.forEach(function (child) {
					var string = child.toString();

					if (string) {
						if (child.is('Selector')) {
							selectors.push(child);
						} else {
							declarations.push(child);
						}
					}
				});

				declarations = "\t" + declarations.join("\n").replace(/\n/g, '\n' + "\t");

				return selectors.join(', ') + " {\n" + declarations + "\n}";
			}
		},

		toCode: {
			value: function () {
				var declarations = [];
				var selectors = [];

				this.forEach(function (child) {
					var string = child.toCode();

					if (string) {
						if (child.is('Selector')) {
							selectors.push(string);
						} else {
							declarations.push(string);
						}
					}
				});

				declarations = arrayUnique(declarations);
				selectors = arrayUnique(selectors);

				if (!declarations.length) {
					return '';
				}

				declarations = declarations.join(stylecow.codeStyle.linebreak);

				if (stylecow.codeStyle.indent) {
					declarations = stylecow.codeStyle.indent + declarations.replace(/\n/g, '\n' + stylecow.codeStyle.indent);
				}

				return selectors.join(stylecow.codeStyle.selectorJoiner) + stylecow.codeStyle.rulesetStart + declarations + stylecow.codeStyle.rulesetEnd;
			}
		}
	});

	function arrayUnique (array) {
		var i, k, a = [];

		for (i = array.length - 1; i >= 0; i--) {
			k = a.indexOf(array[i]);

			if (k === -1) {
				a.unshift(array[i]);
			}
		}

		return a;
	}

})(require('../index'));

},{"../index":16}],13:[function(require,module,exports){
(function (stylecow) {

	stylecow.Selector = function () {
		this.type = 'Selector';
	};

	stylecow.Selector.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				return this.join('');
			}
		},

		toCode: {
			value: function () {
				return this.map(function (child) {
					return child.toCode();
				}).join('');
			}
		}
	});
})(require('../index'));

},{"../index":16}],14:[function(require,module,exports){
(function (stylecow) {

	stylecow.Value = function () {
		this.type = 'Value';
	};

	stylecow.Value.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this.join(' ');
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../index'));

},{"../index":16}],15:[function(require,module,exports){
(function (stylecow) {

	stylecow.Error = function (message, data, prevError) {
		this.message = message;
		this.data = data;
		this.prevError = prevError;
	};

	stylecow.Error.prototype = {

		getFirstError: function () {
			if (this.prevError instanceof stylecow.Error) {
				return this.prevError.getFirstError();
			}

			return this;
		},

		toFullString: function () {
			var string = this.toString();

			if (this.prevError instanceof stylecow.Error) {
				string += '\n------------------\n' + this.prevError.toFullString();
			}

			return string;
		},

		toString: function () {
			var string = this.message;

			for (var key in this.data) {
				if (this.data.hasOwnProperty(key)) {
					string += '\n' + key + ': ' + this.data[key];
				}
			}

			return string;
		},

		toCode: function () {
			var root = stylecow.Root.create('body>*{display:none;}');
			var rule = root.add(new stylecow.Rule());

			rule.content = [
				'content: "' + this.toString().replace(/\n/g, ' \\A ').replace(/"/, '\\"') + '"',
				'background: white',
				'color: black',
				'font-family: monospace',
				'white-space: pre'
			];
			rule.selector = 'body::before';
			
			return root;
		}
	};
})(require('./index'));

},{"./index":16}],16:[function(require,module,exports){
(function (stylecow) {
	var fs = require('fs');

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
		stylecow.support = config.support;
		stylecow.codeStyle = stylecow.codeStyles[config.code];
		stylecow.tasks = {};

		config.plugins.forEach(function (name) {
			if (name[0] === '.') {
				require(name)(stylecow);
			} else {
				require(stylecow.pluginPrefix + name)(stylecow);
			}
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

},{"./config":1,"./css/argument":2,"./css/atrule":3,"./css/base":4,"./css/comment":5,"./css/condition":6,"./css/declaration":7,"./css/function":8,"./css/keyword":9,"./css/nested-atrule":10,"./css/root":11,"./css/rule":12,"./css/selector":13,"./css/value":14,"./error":15,"./index":16,"./parser":17,"fs":18}],17:[function(require,module,exports){
(function (stylecow) {
    var collapsedSpaces = [' ', '\t', '\n', '\r'];
    var collapsedSelector = collapsedSpaces.concat(['>', '~', '+', ',', '{']);
    var collapsedValue = collapsedSpaces.concat([',']);

    var keyChars = ['{', '}', ':', ' ', '*', '.', '[', '#', '+', '>', '~', ';', '(', ')', ',', '/', '&', '@'];

    var COMMENT         = 1;
    var FUNCTION        = 2;
    var KEYWORD         = 4;
    var DECLARATION     = 8;
    var RULE            = 16;
    var SELECTOR        = 32;
    var VALUE           = 64;
    var CONDITION       = 128;

    var HAS_SELECTOR    = 256;
    var HAS_URL         = 512;
    var HAS_VALUE       = 1024;
    var HAS_CONDITION   = 2048;

    var IS_OPENED       = 4096;
    
    var COLLAPSE_SELEC  = 8192;
    var COLLAPSE_VALUE  = 16384;

    var types = {
        AtRule:         DECLARATION,
        Argument:       VALUE | COLLAPSE_VALUE,
        Comment:        COMMENT,
        Condition:      CONDITION,
        Declaration:    DECLARATION,
        Function:       FUNCTION | COLLAPSE_VALUE,
        Keyword:        KEYWORD,
        NestedAtRule:   RULE | HAS_SELECTOR | COLLAPSE_SELEC,
        Selector:       SELECTOR | COLLAPSE_SELEC,
        Root:           RULE | COLLAPSE_SELEC | IS_OPENED,
        Rule:           RULE | HAS_SELECTOR | COLLAPSE_SELEC,
        Value:          VALUE | COLLAPSE_VALUE
    };

    var atRulesTypes = {
        '@media':       RULE | HAS_CONDITION | COLLAPSE_SELEC,
        '@keyframes':   RULE | HAS_VALUE | COLLAPSE_SELEC,
        '@font-face':   RULE | COLLAPSE_SELEC,
        '@supports':    RULE | HAS_CONDITION | COLLAPSE_SELEC,
        '@import':      DECLARATION | HAS_URL | HAS_CONDITION,
        '@charset':     DECLARATION | HAS_VALUE,
        '@namespace':   DECLARATION | HAS_VALUE | HAS_URL,
    };

    var uniqueArgumentFunctions = ['url', 'src'];

    var Parser = function (code, parent) {
        this.code = code;
        this.parent = parent;
    };

    Parser.prototype = {
        add: function (item) {
            item.parent = this.current;
            this.current.push(item);

            return item;
        },

        down: function (item) {
            this.current = this.add(item);
            this.treeTypes.push(this.currType);

            if ((this.current.type === 'AtRule' || this.current.type === 'NestedAtRule') && atRulesTypes[this.current.name]) {
                this.currType = atRulesTypes[this.current.name];
            } else {
                this.currType = types[item.type];
            }

            return this;
        },

        up: function () {
            this.current = this.current.parent;
            this.currType = this.treeTypes.pop();

            return this;
        },

        run: function () {
            this.pos = 0;
            this.col = 0;
            this.line = 0;
            this.buffer = '';
            this.currChar = '';
            this.length = this.code.length;

            this.treeTypes = [];
            this.currType = types[this.parent.type];
            this.current = this.parent;

            while (this.next()) {
                if (this.seek()) {
                    continue;
                }

                if (keyChars.indexOf(this.currChar) !== -1) {
                    if (!this[this.currChar]()) {
                        this.buffer += this.currChar;
                    } else {
                        this.buffer = '';
                    }
                } else {
                    this.buffer += this.currChar;
                }
            }

            if (this.buffer) {
                this.end();
            }

            return this.parent;
        },

        next: function () {
            this.currChar = this.code[this.pos];
            ++this.pos;

            if (this.pos > this.length) {
                return false;
            }

            if (this.currChar === '\n') {
                ++this.line;
                this.col = 0;
            } else {
                ++this.col;
            }

            return true;
        },

        seek: function () {
            //Quotes
            if (this.currChar === '"' || this.currChar === "'") {
                var c = this.currChar;
                this.buffer += this.currChar;

                while (this.next()) {
                    this.buffer += this.currChar;

                    if (this.currChar === c) {
                        break;
                    }
                }

                return true;
            }

            if (this.currType & COLLAPSE_SELEC) {
                if (this.buffer.trim()) {
                    this.collapse(collapsedSelector);
                    return false;
                }
            }

            else if (this.currType & COLLAPSE_VALUE) {
                if (this.buffer.trim()) {
                    this.collapse(collapsedValue);
                    return false;
                }
            }

            if (!this.buffer && collapsedSpaces.indexOf(this.currChar) !== -1) {
                return true;
            }
        },

        end: function () {
            if (this.currType & VALUE || this.currType & SELECTOR) {
                this.add(new stylecow.Keyword(this.buffer));
            }
            else if (this.currType & FUNCTION) {
                this.add(new stylecow.Argument).add(new stylecow.Keyword(this.buffer));
            }
        },

        collapse: function (validChars) {
            if (validChars.indexOf(this.currChar) !== -1) {
                var c = this.currChar.trim();
                var next = this.code[this.pos];

                while (validChars.indexOf(next) !== -1) {
                    if (collapsedSpaces.indexOf(next) === -1) {
                        if (c) {
                            break;
                        }

                        c = next;
                    }
                    this.next();
                    next = this.code[this.pos];
                }

                this.currChar = c || ' ';
            }
        },

        '{': function () {
            if (this.currType & RULE) {
                if (!this.buffer) {
                    this.currType = this.currType | IS_OPENED;
                    return true;
                }

                if (this.currType & IS_OPENED) {
                    this.down(new stylecow.Rule).notOpenedRuleOrDeclaration();

                    if (this.currType & SELECTOR) {
                        this.up();
                    }
                    
                    this.currType = this.currType | IS_OPENED;

                    return true;
                }

                this.notOpenedRuleOrDeclaration();

                if (this.currType & SELECTOR) {
                    this.up();
                }

                this.currType = this.currType | IS_OPENED;
                return true;
            }

            if (this.currType & SELECTOR) {
                this.selector();
                this.up();
                this.currType = this.currType | IS_OPENED;
                return true;
            }
        },

        '}': function () {
            if (this.currType & RULE) {
                this.up();
                return true;
            }

            else if (this.currType & DECLARATION) {
                this.up().up();
                return true;
            }

            else if (this.currType & VALUE) {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }
                this.up().up().up();
                return true;
            }
        },

        ':': function () {
            if (this.currType & RULE) {
                if (this.currType & IS_OPENED) {
                    if (this.isNested()) {
                        return this.down(new stylecow.Rule).notOpenedRuleOrDeclaration();
                    }

                    this.down(new stylecow.Declaration(this.buffer)).down(new stylecow.Value);
                    return true;
                }
            }

            else if (this.buffer && this.buffer.substr(-1) !== ':') {
                return this.selector();
            }
        },

        ' ': function () {
            if (this.currType & VALUE) {
                this.add(new stylecow.Keyword(this.buffer));
                return true;
            }

            else if (this.currType & RULE) {
                if (this.currType & IS_OPENED) {
                    return this.down(new stylecow.Rule).notOpenedRuleOrDeclaration();
                } else {
                    return this.notOpenedRuleOrDeclaration();
                }
            }

            else if (this.currType & DECLARATION) {
                return this.notOpenedRuleOrDeclaration();
            }
        },

        ',': function () {
            if (this.currType & FUNCTION) {
                this.down(new stylecow.Argument);
            }

            else if (this.currType & DECLARATION) {
                this.down(new stylecow.Value);
            }

            else if (this.currType & VALUE) {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }
                var child = new stylecow[this.current.type];
                this.up().down(child);
                return true;
            }

            else if (this.currType & RULE) {
                if (this.currType & IS_OPENED) {
                    this.down(new stylecow.Rule);
                }

                return this.notOpenedRuleOrDeclaration();
            }

            else if (this.currType & SELECTOR) {
                this.selector();
                this.up().down(new stylecow.Selector);
                return true;
            }
        },

        '*': function () {
            return this.selectorOrRule();
        },

        '.': function () {
            return this.selectorOrRule();
        },

        '[': function () {
            return this.selectorOrRule();
        },

        '#': function () {
            return this.selectorOrRule();
        },

        '+': function () {
            return this.selectorOrRule(true);
        },

        '>': function () {
            return this.selectorOrRule(true);
        },

        '~': function () {
            return this.selectorOrRule(true);
        },

        ';': function () {
            if (this.currType & VALUE) {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }
                this.up().up();
                return true;
            }

            else if (this.currType & DECLARATION) {
                if (this.buffer) {
                    this.notOpenedRuleOrDeclaration();
                }
                this.up();
                return true;
            }
        },

        '(': function () {
            if (this.buffer) {
                if (this.currType & VALUE || this.currType & SELECTOR || this.currType & HAS_URL) {
                    this.down(new stylecow.Function(this.buffer));

                    if (uniqueArgumentFunctions.indexOf(this.buffer) !== -1) {
                        this.buffer = '';

                        while (this.next()) {
                            if (this.currChar === ')') {
                                return this[')']();
                            }

                            this.buffer += this.currChar;
                        }
                    }

                    this.down(new stylecow.Argument);
                    return true;
                }
            } else {
                if (this.currType & DECLARATION || (this.currType & RULE && !(this.currType & IS_OPENED))) {
                    return this.notOpenedRuleOrDeclaration();
                }
            }
        },

        ')': function () {
            if (this.current.type === 'Argument') {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }

                this.up().up();
                return true;
            }

            if (this.currType & FUNCTION) {
                if (this.buffer) {
                    this.add(new stylecow.Argument).add(new stylecow.Keyword(this.buffer));
                }

                this.up();
                return true;
            }
        },

        '&': function () {
            if (this.currType & RULE) {
                this.down(new stylecow.Rule);

                return this.notOpenedRuleOrDeclaration(true);
            }
        },

        '@': function () {
            if (this.currType & RULE) {
                this.buffer += this.currChar;

                while (this.next() && collapsedSpaces.indexOf(this.currChar) === -1) {
                    this.buffer += this.currChar;
                }

                var nested;

                if (atRulesTypes[this.buffer]) {
                    nested = atRulesTypes[this.buffer] & RULE;
                } else {
                    nested = this.isNested();
                }

                if (nested) {
                    this.down(new stylecow.NestedAtRule(this.buffer));
                } else {
                    this.down(new stylecow.AtRule(this.buffer));
                }

                return true;
            }
        },

        '/': function () {
            if (this.code[this.pos] === '*') {
                var c = '';

                this.next();

                while (this.next()) {
                    c += this.currChar;

                    if (this.currChar === '*' && this.code[this.pos] === '/') {
                        this.add(new stylecow.Comment(c.slice(0, -1)));
                        this.next();
                        return true;
                    }
                }
            }
        },

        selectorOrRule: function (operator) {
            if (this.currType & SELECTOR) {
                return this.selector(operator);
            }

            if (this.currType & RULE) {
                if (this.currType & IS_OPENED) {
                    this.down(new stylecow.Rule);
                }
                
                return this.notOpenedRuleOrDeclaration(operator);
            }
        },

        selector: function (operator) {
            var r;

            if (this.buffer) {
                this.add(new stylecow.Keyword(this.buffer));
                r = true;
            }

            if (operator) {
                this.add(new stylecow.Keyword(this.currChar));
                r = true;
            }

            return r;
        },

        isNested: function () {
            var isNested = this.code.indexOf('{', this.pos);

            return (isNested !== -1 && isNested < this.code.indexOf(';', this.pos) && isNested < this.code.indexOf('}', this.pos));
        },

        notOpenedRuleOrDeclaration: function (operator) {
            if (this.currType & HAS_VALUE) {
                if ((this.buffer[0] !== '"' && this.buffer[0] !== "'") || !(this.currType & HAS_URL)) {
                    this.add(new stylecow.Value).add(new stylecow.Keyword(this.buffer));
                    this.currType = this.currType ^ HAS_VALUE;
                    return true;
                }
            }

            if (this.currType & HAS_URL) {
                var matches = this.buffer.trim().match(/^(url\(|'|")['"]?([^'"\)]+)/);

                if (matches) {
                    this.add(new stylecow.Function('url')).add(new stylecow.Argument).add(new stylecow.Keyword(matches[2]));
                    this.currType = this.currType ^ HAS_URL;
                    return true;
                }
            }

            if (this.currType & HAS_SELECTOR) {
                this.down(new stylecow.Selector);
                return this.selector(operator);
            }

            if (this.currType & HAS_CONDITION) {
                this.buffer += this.currChar;
                var deep = (this.currChar === '(') ? 1 : 0;

                while (this.next()) {
                    if (this.currChar === '(') {
                        ++deep;
                    }

                    else if (this.currChar === ')') {
                        --deep;
                    }

                    else if (!deep) {
                        if (this.currChar === '{') {
                            this.current.add(new stylecow.Condition(this.buffer.trim()));
                            this.currType = this.currType ^ HAS_CONDITION;
                            this.currType = this.currType | IS_OPENED;
                            return true;
                        }

                        else if (this.currChar === ';') {
                            this.current.add(new stylecow.Condition(this.buffer.trim()));
                            this.currType = this.currType ^ HAS_CONDITION;
                            this.up();
                            return true;
                        }
                    }

                    this.buffer += this.currChar;
                }
            }
        }
    };

    stylecow.parse = function (code, parent) {
        if (typeof parent === 'string') {
            parent = new stylecow[parent];
        } else {
            parent = parent || new stylecow.Root();
        }

        var parser = new Parser('' + code, parent);

        return parser.run();
    };

})(require('./index'));

},{"./index":16}],18:[function(require,module,exports){

},{}]},{},["./browser"]);
