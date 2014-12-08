(function (stylecow) {

	stylecow.Block = function () {
		this.class = 'Block';
		this.type = 'Block';
	};

	stylecow.Block.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return "{\n" + "\t" + this.join("\n").replace(/\n/g, '\n' + "\t") + "\n}";
			}
		},

		parse: {
			value: function (reader) {
				reader.run(this, parseChild, '}');
			}
		}
	});

	function parseChild (parent, reader) {
		if (reader.isComment()) {
			return parent.add(new stylecow.Comment()).parse(reader);
		}

		if (reader.isAtRule()) {
			if (reader.isNested()) {
				return parent.add(new stylecow.NestedAtRule()).parse(reader);
			}

			return parent.add(new stylecow.AtRule()).parse(reader);
		}

		if (reader.isNested()) {
			return parent.add(new stylecow.Rule()).parse(reader);
		}

		return parent.add(new stylecow.Declaration()).parse(reader);
	}
})(require('../index'));
