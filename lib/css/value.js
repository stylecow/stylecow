(function (stylecow) {

	stylecow.Value = function () {};

	stylecow.Value.createFromString = function (string) {
		return stylecow.Value.create(new stylecow.Reader(string));
	};

	stylecow.Value.create = function (reader) {
		var element = reader.setData(new stylecow.Value());

        reader.addBreakChar(',');

		reader.execute(function () {
			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			if (reader.isString()) {
				return element.push(stylecow.String.create(reader));
			}

			if (reader.isExpression()) {
				return element.push(stylecow.Expression.create(reader));
			}

			if (reader.isFunction()) {
				return element.push(stylecow.Function.create(reader));
			}

			element.push(stylecow.Keyword.create(reader));
		});

		return element;
	};

	stylecow.Value.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Value'
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
