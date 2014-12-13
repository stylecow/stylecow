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

		reader.parse(this, new stylecow.Element());
	}
})(require('../index'));
