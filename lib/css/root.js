(function (stylecow) {

	stylecow.Root = function () {};

	stylecow.Root.createFromString = function (string) {
		return stylecow.Root.create(new stylecow.Reader(string));
	};

	stylecow.Root.create = function (reader) {
		var element = reader.setData(new stylecow.Root());

        reader.addBreakChar(null);

		reader.execute(function () {
			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			if (reader.isAtRule()) {
				return element.push(stylecow.AtRule.create(reader));
			}

			element.push(stylecow.Rule.create(reader));
		});

		return element;
	};

	stylecow.Root.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Root'
		},

		toString: {
			value: function () {
				return this.map(function (child) {
					return child.toString();
				}).filter(function (string) {
					return string ? true : false;
				}).join("\n");
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child) {
					child.toCode(code);
					code.append(code.style.linebreak);
				});
			}
		}
	});
})(require('../index'));
