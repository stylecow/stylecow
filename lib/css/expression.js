(function (stylecow) {

	stylecow.Expression = function (name) {
		this.class = 'Expression';
		this.type = 'Expression';

		if (name) {
			this.name = name;
		}
	};

	stylecow.Expression.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				return '(' + this.name + ')';
			}
		},

		parse: {
			value: function (reader) {
				reader.trim();
				this.name = reader.seekAndFetch(')').slice(1);
			}
		}
	});
})(require('../index'));
