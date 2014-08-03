(function (css) {
	var utils = require('../utils');

	css.Function = function (name, args) {
		this.type = 'Function';
		this.name = name;
		this.content = args;
	};

	css.Function.create = function (string) {
		var matches = string.match(/^([\w\.\:-]+)\((.*)\)$/);

		return new css.Function(matches[1], utils.explodeTrim(',', matches[2]));
	};

	css.Function.prototype = Object.create(css.Base, {

		parseChild: {
			value: function (string) {
				var value = css.Value.create(string);

				if (value.length === 1) {
					return value[0];
				}

				return value;
			}
		},

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
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
			value: function (style) {
				return this.name + '(' + this.map(function (child) {
					return child.toCode(style);
				}).join(style.argumentJoiner) + ')';
			}
		}
	});
})(require('../css'));
