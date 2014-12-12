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

		parse: {
			value: function (reader) {
				reader.breakOn(null);
				reader.execute(parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return this.add(new stylecow.Comment()).parse(reader);
		}

		if (reader.isAtRule()) {
			return this.add(new stylecow.AtRule()).parse(reader);
		}

		return this.add(new stylecow.Rule()).parse(reader);
	}
})(require('../index'));
