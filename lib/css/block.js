(function (stylecow) {

	stylecow.Block = function () {};

	stylecow.Block.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Block'
		},

		toString: {
			value: function () {
				return "{\n" + "\t" + this.join("\n").replace(/\n/g, '\n' + "\t") + "\n}";
			}
		},

		parse: {
			value: function (reader) {
				reader.breakOn('}', true);
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

		if (reader.isNested()) {
			return this.add(new stylecow.Rule()).parse(reader);
		}

		return this.add(new stylecow.Declaration()).parse(reader);
	}
})(require('../index'));
