(function (stylecow) {

	stylecow.Value = function (name) {
		this.type = 'Value';
		this.name = name;
	};

	stylecow.Value.create = function (string) {
		return new stylecow.Value(string);
	};

	stylecow.Value.prototype = Object.create(stylecow.Base, {

		parseChild: {
			value: function (string) {
				if (/^[\w\.-]+\(/.test(string)) {
					return stylecow.Function.create(string);
				}

				return stylecow.Keyword.create(string);
			}
		},

		name: {
			get: function () {
				return this.join(' ');
			},
			set: function (name) {
				this.content = stylecow.utils.explodeTrim(' ', name);
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../index'));
