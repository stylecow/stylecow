(function (stylecow) {

	stylecow.Selectors = function () {};

	stylecow.Selectors.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Selectors'
		},

		toString: {
			value: function () {
				return this.join(', ');
			}
		},

		parse: {
			value: function (reader) {
				reader.breakOn('{', true);
				reader.execute(parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return this.add(new stylecow.Comment()).parse(reader);
		}

		return this.add(new stylecow.Selector()).parse(reader);
	}
})(require('../index'));
