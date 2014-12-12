(function (stylecow) {

	stylecow.Expression = function () {};

	stylecow.Expression.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Expression'
		},

		toString: {
			value: function () {
				return '(' + this.name + ')';
			}
		},

		parse: {
			value: function (reader) {
				this.name = reader.seek(')').slice(1);
			}
		}
	});
})(require('../index'));
