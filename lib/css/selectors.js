(function (stylecow) {

	stylecow.Selectors = function () {};

	stylecow.Selectors.createFromString = function (string) {
		return stylecow.Selectors.create(new stylecow.Reader(string));
	};

	stylecow.Selectors.create = function (reader) {
		var element = reader.setData(new stylecow.Selectors());

        reader.addBreakChar('{', true);

		reader.execute(function () {
			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			element.push(stylecow.Selector.create(reader));
		});

		return element;
	};

	stylecow.Selectors.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Selectors'
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
