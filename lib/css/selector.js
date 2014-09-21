(function (stylecow) {

	stylecow.Selector = function (name) {
		this.type = 'Selector';
		this.name = name;
	};

	stylecow.Selector.create = function (string) {
		return new stylecow.Selector(string);
	};

	stylecow.Selector.prototype = Object.create(stylecow.Base, {

		parseChild: {
			value: function (string) {
				if (/\w\(/.test(string)) {
					return stylecow.Function.create(string);
				}

				return stylecow.Keyword.create(string);
			}
		},

		name: {
			get: function () {
				return this.join('');
			},
			set: function (name) {
				this.content = stylecow.utils.parseSelector(name);
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
})(require('../index'));
