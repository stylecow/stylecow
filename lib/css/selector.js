(function (stylecow) {

	stylecow.Selector = function () {};

	stylecow.Selector.createFromString = function (string) {
		return stylecow.Selector.create(new stylecow.Reader(string));
	};

	stylecow.Selector.create = function (reader) {
		var element = reader.setData(new stylecow.Selector());

        reader.addBreakChar(',');

		reader.execute(function () {
			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			element.push(stylecow.Element.create(reader));
		});

		return element;
	};

	stylecow.Selector.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Selector'
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
