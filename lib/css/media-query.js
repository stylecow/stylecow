(function (stylecow) {

	stylecow.MediaQuery = function () {
		this.class = 'MediaQuery';
		this.type = 'MediaQuery';
	};

	stylecow.MediaQuery.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		parse: {
			value: function (reader) {
				reader.run(this, parseChild, ',');
			}
		}
	});

	function parseChild (parent, reader) {
		if (reader.isComment()) {
			return parent.add(new stylecow.Comment()).parse(reader);
		}

		if (reader.isExpression()) {
			return parent.add(new stylecow.Expression()).parse(reader);
		}

		return parent.add(new stylecow.Keyword()).parse(reader);
	}
})(require('../index'));
