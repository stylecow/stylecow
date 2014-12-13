(function (stylecow) {

	stylecow.Rule = function () {};

	stylecow.Rule.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Rule'
		},

		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child, k) {
					child.toCode(code);
				});
			}
		},

		parse: {
			value: function (reader) {
				reader.parse(this, new stylecow.Selectors());
				reader.parse(this, new stylecow.Block());
			}
		}
	});

})(require('../index'));
