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

		toCode: {
			value: function (code) {
				this.forEach(function (child) {
					child.toCode(code);
				});
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
			return reader.parse(this, new stylecow.Comment());
		}

		if (reader.isCombinator()) {
			return reader.parse(this, new stylecow.Combinator());
		}

		if (reader.isFunction()) {
			return reader.parse(this, new stylecow.Function());
		}

		return reader.parse(this, new stylecow.Keyword());
	}
})(require('../index'));
