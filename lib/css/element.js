(function (stylecow) {

	stylecow.Element = function () {};

	stylecow.Element.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Element'
		},

		toString: {
			value: function () {
				return this.join('');
			}
		},

		parse: {
			value: function (reader) {
				reader.breakOn(' ');
				reader.execute(parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return this.add(new stylecow.Comment()).parse(reader);
		}

		if (reader.isCombinator()) {
			this.add(new stylecow.Combinator()).parse(reader);
		}

		if (reader.isFunction()) {
			return this.add(new stylecow.Function()).parse(reader);
		}

		return this.add(new stylecow.Keyword()).parse(reader);
	}
})(require('../index'));
