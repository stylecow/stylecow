(function (stylecow) {

	stylecow.MediaQueries = function () {
		this.class = 'MediaQueries';
		this.type = 'MediaQueries';
	};

	stylecow.MediaQueries.prototype = Object.create(stylecow.Base, {
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

		return parent.add(new stylecow.MediaQuery()).parse(reader);
	}
})(require('../index'));
