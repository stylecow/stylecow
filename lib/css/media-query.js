(function (stylecow) {

	stylecow.MediaQuery = function () {};

	stylecow.MediaQuery.createFromString = function (string) {
		return stylecow.MediaQuery.create(new stylecow.Reader(string));
	};

	stylecow.MediaQuery.create = function (reader) {
		var element = reader.setData(new stylecow.MediaQuery());

        reader.addBreakChar(',');

		reader.execute(function () {
			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			if (reader.isExpression()) {
				return element.push(stylecow.Expression.create(reader));
			}

			element.push(stylecow.Keyword.create(reader));
		});

		return element;
	};

	stylecow.MediaQuery.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'MediaQuery'
		},

		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(' ');
					}
				});
			}
		}
	});
})(require('../index'));
