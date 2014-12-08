(function (stylecow) {

	stylecow.Rule = function () {
		this.class = 'Rule';
		this.type = 'Rule';
	};

	stylecow.Rule.prototype = Object.create(stylecow.Base, {

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
