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

		parse: {
			value: function (reader) {
				this.add(new stylecow.Selectors()).parse(reader);
				this.add(new stylecow.Block()).parse(reader);
			}
		}
	});

})(require('../index'));
