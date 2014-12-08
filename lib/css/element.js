(function (stylecow) {

	stylecow.Element = function () {
		this.class = 'Element';
		this.type = 'Element';
	};

	stylecow.Element.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.join('');
			}
		},

		parse: {
			value: function (reader) {
				reader.breakOn('>');
				reader.breakOn('~');
				reader.breakOn('+');
				reader.run(this, parseChild, ' ');

				while (reader.breakChars.shift() !== '>') {}
			}
		}
	});

	function parseChild (parent, reader) {
		if (reader.isFunction()) {
			return parent.add(new stylecow.Function()).parse(reader);
		}

		if (reader.isComment()) {
			return parent.add(new stylecow.Comment()).parse(reader);
		}

		if (reader.isCombinator()) {
			parent.add(new stylecow.Combinator()).parse(reader);
			return false;
		}

		return parent.add(new stylecow.Keyword()).parse(reader);
	}
})(require('../index'));
