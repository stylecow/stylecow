(function (css) {
	var utils = require('../utils');

	css.Value = function (name) {
		this.type = 'Value';
		this.name = name;
	};

	css.Value.create = function (string) {
		return new css.Value(string);
	};

	css.Value.prototype = Object.create(css.Base, {

		parseChild: {
			value: function (string) {
				if (/^[\w\.-]+\(/.test(string)) {
					return css.Function.create(string);
				}

				return css.Keyword.create(string);
			}
		},

		name: {
			get: function () {
				return this.join(' ');
			},
			set: function (name) {
				this.content = utils.explodeTrim(' ', name);
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../css'));
