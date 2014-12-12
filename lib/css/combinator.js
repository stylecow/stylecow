(function (stylecow) {

	stylecow.Combinator = function () {};

	stylecow.Combinator.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Combinator'
		},

		toString: {
			value: function () {
				return this.name;
			}
		},

		parse: {
			value: function (reader) {
				this.name = reader.currChar;
				reader.next();
			}
		}
	});
})(require('../index'));
