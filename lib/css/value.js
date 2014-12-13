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

		toCode: {
			value: function (code) {
				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(' ');
					}
				});
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
			return reader.parse(this, new stylecow.Comment());
		}

		if (reader.isString()) {
			return reader.parse(this, new stylecow.String());
		}

		if (reader.isExpression()) {
			return reader.parse(this, new stylecow.Expression());
		}

		if (reader.isFunction()) {
			return reader.parse(this, new stylecow.Function());
		}

		return reader.parse(this, new stylecow.Keyword());
	}
})(require('../index'));
