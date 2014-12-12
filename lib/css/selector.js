(function (stylecow) {

	stylecow.Selector = function () {};

	stylecow.Selector.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Selector'
		},

		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		parse: {
			value: function (reader) {
				reader.breakOn(',');
				reader.execute(parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return this.add(new stylecow.Comment()).parse(reader);
		}

		return this.add(new stylecow.Element()).parse(reader);
	}
})(require('../index'));
