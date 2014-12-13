(function (stylecow) {

	stylecow.Root = function () {};

	stylecow.Root.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Root'
		},

		toString: {
			value: function () {
				return this.map(function (child) {
					return child.toString();
				}).filter(function (string) {
					return string ? true : false;
				}).join("\n");
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child) {
					child.toCode(code);

					code.append(code.style.linebreak);
				});
			}
		},

		parse: {
			value: function (reader) {
				reader.breakOn(null);
				reader.execute(parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return reader.parse(this, new stylecow.Comment());
		}

		if (reader.isAtRule()) {
			return reader.parse(this, new stylecow.AtRule());
		}

		reader.parse(this, new stylecow.Rule());
	}
})(require('../index'));
