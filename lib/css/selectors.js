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
				reader.executeUntil('{', parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return this.add(new stylecow.Comment()).parse(reader);
		}

		return this.add(new stylecow.Selector()).parse(reader);
	}
})(require('../index'));
