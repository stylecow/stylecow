(function (stylecow) {

	stylecow.Selector = function () {
		this.class = 'Selector';
		this.type = 'Selector';
	};

	stylecow.Selector.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		parse: {
			value: function (reader) {
				reader.executeUntil(',', parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return this.add(new stylecow.Comment()).parse(reader);
		}

		return this.add(new stylecow.Element()).parse(reader);
	}
})(require('../index'));
