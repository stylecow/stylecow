(function (stylecow) {

	stylecow.MediaQueries = function () {};

	stylecow.MediaQueries.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'MediaQueries'
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

		return this.add(new stylecow.MediaQuery()).parse(reader);
	}
})(require('../index'));
