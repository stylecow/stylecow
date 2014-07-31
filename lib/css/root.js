(function (css) {
	var utils = require('../utils');

	css.Root = function () {
		this.type = 'Root';
	};

	css.Root.create = function (string) {
		return utils.parseCode(string, new css.Root);
	};

	css.Root.prototype = Object.create(css.Base, {

		executePlugins: {
			value: function (plugins) {
				for (var k in plugins) {
					if (plugins.hasOwnProperty(k)) {
						this.executePlugin(k, plugins[k], 'Before');
					}
				}

				css.Base.executePlugins.call(this, plugins);
			}
		},

		transform: {
			value: function () {
				var plugins = require('../plugins');

				this.executePlugins(plugins);
			}
		},

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
				}).join(this.getData('linebreak'));
			}
		}
	});
})(require('../css'));
