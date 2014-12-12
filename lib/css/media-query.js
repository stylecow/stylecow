(function (stylecow) {

	stylecow.MediaQuery = function () {};

	stylecow.MediaQuery.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'MediaQuery'
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

		if (reader.isExpression()) {
			return this.add(new stylecow.Expression()).parse(reader);
		}

		return this.add(new stylecow.Keyword()).parse(reader);
	}
})(require('../index'));
