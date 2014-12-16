(function (stylecow) {

	stylecow.Element = function () {};

	stylecow.Element.createFromString = function (string) {
		return stylecow.Element.create(new stylecow.Reader(string));
	};

	stylecow.Element.create = function (reader) {
		var element = reader.setData(new stylecow.Element());

		reader.addBreakChar(' ');

		reader.execute(function () {
			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			if (reader.isCombinator()) {
				return element.push(stylecow.Combinator.create(reader));
			}

			if (reader.isFunction()) {
				return element.push(stylecow.Function.create(reader));
			}

			return element.push(stylecow.Keyword.create(reader));
		});

		return element;
	};

	stylecow.Element.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Element'
		},

		toString: {
			value: function () {
				return this.join('');
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child) {
					child.toCode(code);
				});
			}
		}
	});
})(require('../index'));
