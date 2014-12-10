(function (stylecow) {

	stylecow.Combinator = function (name) {
		this.class = 'Combinator';
		this.type = 'Combinator';
		
		if (name) {
			this.name = name;
		}
	};

	stylecow.Combinator.prototype = Object.create(stylecow.Base, {

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
