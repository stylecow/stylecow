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

		toCode: {
			value: function (code) {
				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(code.style.valueJoiner);
					}
				});
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
			return reader.parse(this, new stylecow.Comment());
		}

		reader.parse(this, new stylecow.MediaQuery());
	}
})(require('../index'));
