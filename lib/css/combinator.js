(function (stylecow) {

	stylecow.Combinator = function () {};

	stylecow.Combinator.createFromString = function (string) {
		return stylecow.Combinator.create(new stylecow.Reader(string));
	};

	stylecow.Combinator.create = function (reader) {
		var element = reader.setData(new stylecow.Combinator());

		element.name = reader.currChar;
		reader.next();

		return element;
	};

	stylecow.Combinator.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Combinator'
		},

		toString: {
			value: function () {
				return this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.name, this);
			}
		}
	});
})(require('../index'));
