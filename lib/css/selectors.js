(function (stylecow) {

	stylecow.Selectors = function () {
		this.class = 'Selectors';
		this.type = 'Selectors';
	};

	stylecow.Selectors.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.join(', ');
			}
		},

		parse: {
			value: function (reader) {
				reader.run(this, parseChild, '{');
			}
		}
	});

	function parseChild (parent, reader) {
		if (reader.isComment()) {
			return parent.add(new stylecow.Comment()).parse(reader);
		}

		return parent.add(new stylecow.Selector()).parse(reader);
	}
})(require('../index'));
