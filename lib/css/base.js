(function (stylecow) {
	var Collection = function () {};

	Collection.prototype = Object.create(Array.prototype, {
		children: {
			value: function (match) {
				var result = new Collection;

				for (var i = 0, t = this.length; i < t; ++i) {
					if (this[i].is(match)) {
						result.push(this[i]);
					}
				};

				return result;
			}
		},

		firstChild: {
			value: function (match) {
				for (var i = 0, t = this.length; i < t; ++i) {
					if (this[i].is(match)) {
						return this[i];
					}
				};
			}
		},

		hasChild: {
			value: function (match) {
				return this.some(function (child) {
					return child.is(match);
				});
			}
		},

		search: {
			value: function (match, result) {
				result = result || new Collection;

				for (var i = 0, t = this.length; i < t; i++) {
					if (this[i].is(match)) {
						result.push(this[i]);
					} else {
						this[i].search(match, result);
					}
				}

				return result;
			}
		},

		searchFirst: {
			value: function (match) {
				for (var i = 0, t = this.length; i < t; i++) {
					if (this[i].is(match)) {
						return this[i];
					}
					
					var found = this[i].searchFirst(match);

					if (found) {
						return found;
					}
				}
			}
		},

		has: {
			value: function (match) {
				for (var i = 0, t = this.length; i < t; i++) {
					if (this[i].is(match) || this[i].has(match)) {
						return true;
					}
				}

				return false;
			}
		}
	});

	stylecow.Base = Object.create(Collection.prototype, {
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
				var clone = new stylecow[this.type](this.name);

				this.forEach(function (child) {
					clone.push(child.clone());
				});

				clone._data = this._data;

				return clone;
			}
		},

		cloneBefore: {
			value: function () {
				return this.before(this.clone());
			}
		},

		cloneAfter: {
			value: function () {
				return this.after(this.clone());
			}
		},

		is: {
			value: function (match) {
				if (match.type && !equals(this.type, match.type)) {
					return false;
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

				if (match.string && !equals(this.toString(), match.string)) {
					return false;
				}

				return true;
			}
		},

		parent: {
			value: function (match) {
				if (this._parent) {
					if (!match || this._parent.is(match)) {
						return this._parent;
					}

					return this._parent.parent(match);
				}
			}
		},

		setContent: {
			value: function (content) {
				this.splice(0);

				if (content instanceof Array) {
					content.forEach(function (child) {
						stylecow.parse(child, this);
					}, this);
				} else {
					stylecow.parse(content, this);
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
				if (('_data' in this) && (key in this._data)) {
					return this._data[key];
				}

				if (this._parent) {
					return this._parent.getData(key);
				}
			}
		},

		setData: {
			value: function (key, value) {
				if (!('_data' in this)) {
					this._data = {};
				}

				this._data[key] = value;

				return this;
			}
		},

		index: {
			value: function () {
				if (this._parent) {
					return this._parent.indexOf(this);
				}

				return -1;
			}
		},

		push: {
			value: function () {
				for (var i = arguments.length - 1; i >= 0; i--) {
					arguments[i].detach();
					arguments[i]._parent = this;
				};

				return Array.prototype.push.apply(this, arguments);
			}
		},

		unshift: {
			value: function () {
				for (var i = arguments.length - 1; i >= 0; i--) {
					arguments[i].detach();
					arguments[i]._parent = this;
				};

				return Array.prototype.unshift.apply(this, arguments);
			}
		},

		splice: {
			value: function () {
				if (arguments.length > 2) {
					for (var i = arguments.length - 1; i >= 2; i--) {
						arguments[i].detach();
						arguments[i]._parent = this;
					};
				}

				return Array.prototype.splice.apply(this, arguments);
			}
		},

		next: {
			value: function () {
				var index = this.index();

				if (index !== -1) {
					return this._parent[index + 1];
				}
			}
		},

		prev: {
			value: function () {
				var index = this.index();

				if (index > 0) {
					return this._parent[index - 1];
				}
			}
		},

		add: {
			value: function (child, index) {
				if (typeof child === 'string') {
					var root = new stylecow[this.type];
					stylecow.parse(child, root);

					if (root._parent) {
						root = root._parent;
					}

					if (index === undefined) {
						this.push.apply(this, root);
					} else {
						this.splice.apply(this, [index, 0].concat(root.slice(0)));
					}

					return root[0];
				}

				if (index === undefined || index > this.length) {
					this.push(child);
				} else {
					this.splice(index, 0, child);
				}

				return child;
			}
		},

		before: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					return this._parent.add(child, index);
				}
			}
		},

		after: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					if (index === this.length) {
						return this._parent.add(child);
					}

					return this._parent.add(child, index + 1);
				}
			}
		},

		replaceWith: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					var parent = this._parent;
					this.remove();

					return parent.add(child, index);
				}
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

				this._parent = null;

				Array.prototype.splice.call(this, 0);

				return this;
			}
		},

		detach: {
			value: function () {
				var index = this.index();

				if (index !== -1) {
					Array.prototype.splice.call(this._parent, index, 1);
					this._parent = null;
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

		var i, name = element.name;

		if (tasks.hasOwnProperty('*')) {
			for (i = tasks['*'].length - 1; i >= 0; i--) {
				tasks['*'][i](element);
			};
		}

		if (tasks.hasOwnProperty(name)) {
			for (i = tasks[name].length - 1; i >= 0; i--) {
				tasks[name][i](element);
			};
		}
	}

})(require('../index'));
