(function (stylecow) {

	stylecow.Root = function () {
		this.class = 'Root';
		this.type = 'Root';
	};

	stylecow.Root.prototype = Object.create(stylecow.Base, {
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
				reader.executeUntil(null, parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return this.add(new stylecow.Comment()).parse(reader);
		}

		if (reader.isAtRule()) {
			if (reader.isNested()) {
				return this.add(new stylecow.NestedAtRule()).parse(reader);
			}

			return this.add(new stylecow.AtRule()).parse(reader);
		}

		return this.add(new stylecow.Rule()).parse(reader);
	}
})(require('../index'));
