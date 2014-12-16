(function (stylecow) {

	stylecow.MediaQueries = function () {};

	stylecow.MediaQueries.createFromString = function (string) {
		return stylecow.MediaQueries.create(new stylecow.Reader(string));
	};

	stylecow.MediaQueries.create = function (reader) {
		var element = reader.setData(new stylecow.MediaQueries());

		reader.addBreakChar('{', true);

		reader.execute(function () {
			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			element.push(stylecow.MediaQuery.create(reader));
		});

		return element;
	};

	stylecow.MediaQueries.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'MediaQueries'
		},

		toString: {
			value: function () {
				return this.join(', ');
			}
		},

		toCode: {
			value: function (code) {
				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(code.style.valueJoiner);
					}
				});
			}
		}
	});
})(require('../index'));
