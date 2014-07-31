(function (css) {
	var utils = require('../utils');
	var config = require('../config');

	css.Base = Object.create(Array.prototype, {
		executePlugins: {
			value: function (plugins, vendor) {
				var thisVendor = this.vendor;

				if (vendor) {
					if (thisVendor && thisVendor !== vendor) {
						return this.remove();
					}
				} else {
					vendor = thisVendor;
				}

				var k = 0;

				while (this[k]) {
					var child = this[k];

					if (child.executed) {
						++k;
						continue;
					}

					child.executePlugins(plugins, vendor);

					k = 0;
				}

				for (k in plugins) {
					if (plugins.hasOwnProperty(k)) {
						this.executePlugin(k, plugins[k], '');
					}
				}

				this.executed = true;
			}
		},

		executePlugin: {
			value: function (pluginName, plugin, suffix) {
				var enabled = this.getData(pluginName);

				if (enabled === undefined) {
					enabled = plugin.enabled;
				}

				if (enabled === false) {
					return;
				}

				var fnName = this.type + suffix, k, t, execute;

				for (k = 0, t = plugin.execute.length; k < t; k++) {
					execute = plugin.execute[k];

					if (!execute[fnName] || !utils.needFix(this, execute.disable)) {
						continue;
					}

					if (execute[fnName] instanceof Function) {
						execute[fnName](this);
						continue
					}

					if (!this.name) {
						continue
					}

					var namePlugin = execute[fnName][this.name];

					if (!namePlugin) {
						namePlugin = execute[fnName][this.module];
					}

					if (namePlugin instanceof Function) {
						namePlugin(this);
						continue;
					}
				}
			}
		},

		clone: {
			value: function () {
				return css[this.type].create(this.toString());
			}
		},

		is: {
			value: function (type, name, value) {
				if (type && !equals(this.type, type)) {
					return false;
				}

				if (name && !equals(this.name, name)) {
					return false;
				}

				if (value && !equals(this.value, value)) {
					return false;
				}

				return true;
			}
		},

		children: {
			value: function (type, name, value) {
				return this.filter(function (child) {
					return child.is(type, name, value);
				});
			}
		},

		hasChild: {
			value: function (type, name, value) {
				return this.some(function (child) {
					return child.is(type, name, value);
				});
			}
		},

		search: {
			value: function (type, name, value, result) {
				result = result || [];

				if (this.is(type, name, value)) {
					result.push(this);
				}

				for (var i = 0, t = this.length; i < t; i++) {
					this[i].search(type, name, value, result);
				};

				return result;
			}
		},

		has: {
			value: function (type, name, value) {
				if (this.is(type, name, value)) {
					return true;
				}

				for (var i = 0, t = this.length; i < t; i++) {
					if (this[i].has(type, name, value)) {
						return true;
					}
				};

				return false;
			}
		},

		ancestor: {
			value: function (type, name, value) {
				if (this.is(type, name, value)) {
					return this;
				}

				if (this.parent) {
					return this.parent.ancestor(type, name, value);
				}
			}
		},

		content: {
			get: function () {
				return this.map(function (child) {
					return child.toString();
				});
			},
			set: function (value) {
				this.splice(0);

				if (value instanceof Array) {
					value.forEach(function (v) {
						this.add(v);
					}, this);
				} else {
					this.add(value);
				}
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

				return config.defaults[key];
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

		vendor: {
			get: function () {
				if (this._vendor) {
					return this._vendor;
				}

				if (this.parent) {
					return this.parent.vendor;
				}
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
				if (typeof child !== 'object') {
					child = this.parseChild(''+child);
				}

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

		append: {
			value: function (child) {
				this.add(child);
			}
		},

		prepend: {
			value: function (child) {
				this.add(child, 0);
			}
		},

		insertBefore: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					return this.parent.add(child, index);
				}
			}
		},

		insertAfter: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					return this.parent.add(child, index, true);
				}
			}
		},

		cloneBefore: {
			value: function () {
				return this.insertBefore(this.clone());
			}
		},

		cloneAfter: {
			value: function () {
				return this.insertAfter(this.clone());
			}
		},

		replaceWith: {
			value: function (child) {
				var index = this.index();

				if (index !== -1) {
					var parent = this.parent;
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

})(require('../css'));