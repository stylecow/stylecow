(function (css) {
	var utils = require('../utils');
	var stylecow = require('../index.js');

	css.Root = function () {
		this.type = 'Root';
	};

	css.Root.create = function (string) {
		return utils.parseCode(string, new css.Root);
	};

	css.Root.prototype = Object.create(css.Base, {

		executePlugins: {
			value: function (plugins, minSupport, vendor) {
				for (var k in plugins) {
					if (plugins.hasOwnProperty(k)) {
						this.executePlugin(k, 'Before', plugins[k], minSupport);
					}
				}

				css.Base.executePlugins.call(this, plugins, minSupport, vendor);
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
			value: function (style) {
				return this.map(function (child) {
					return child.toCode(style);
				}).filter(function (string) {
					return string ? true : false;
				}).join(style.linebreak);
			}
		}
	});
})(require('../css'));
