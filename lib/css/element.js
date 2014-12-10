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
				reader.executeUntil(' ', parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isFunction()) {
			return this.add(new stylecow.Function()).parse(reader);
		}

		if (reader.isComment()) {
			return this.add(new stylecow.Comment()).parse(reader);
		}

		if (reader.isCombinator()) {
			this.add(new stylecow.Combinator()).parse(reader);
		}

		return this.add(new stylecow.Keyword()).parse(reader);
	}
})(require('../index'));
