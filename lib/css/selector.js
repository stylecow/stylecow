(function (css) {
	var utils = require('../utils');

	css.Selector = function (name) {
		this.type = 'Selector';
		this.name = name;
	};

	css.Selector.create = function (string) {
		return new css.Selector(string);
	};

	css.Selector.prototype = Object.create(css.Base, {

		parseChild: {
			value: function (string) {
				if (/\w\(/.test(string)) {
					return css.Function.create(string);
				}

				return css.Keyword.create(string);
			}
		},

		name: {
			get: function () {
				return this.join('');
			},
			set: function (name) {
				this.content = utils.parseSelector(name);
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		},

		toCode: {
			value: function (style) {
				return this.map(function (child) {
					return child.toCode(style);
				}).join('');
			}
		}
	});
})(require('../css'));
