(function (stylecow) {

	stylecow.Value = function () {};

	stylecow.Value.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Value'
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

		if (reader.isString()) {
			return this.add(new stylecow.String()).parse(reader);
		}

		if (reader.isExpression()) {
			return this.add(new stylecow.Expression()).parse(reader);
		}

		if (reader.isFunction()) {
			return this.add(new stylecow.Function()).parse(reader);
		}

		return this.add(new stylecow.Keyword()).parse(reader);
	}
})(require('../index'));
