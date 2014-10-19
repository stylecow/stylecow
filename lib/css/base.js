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
