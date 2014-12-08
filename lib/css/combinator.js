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
				reader.trim();
				this.name = reader.fetch();
			}
		}
	});
})(require('../index'));
