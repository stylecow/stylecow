(function (stylecow) {

	stylecow.Rule = function () {};

	stylecow.Rule.createFromString = function (string) {
		return stylecow.Rule.create(new stylecow.Reader(string));
	};

	stylecow.Rule.create = function (reader) {
		var element = reader.setData(new stylecow.Rule());

        element.push(stylecow.Selectors.create(reader));
        element.push(stylecow.Block.create(reader));

		return element;
	};

	stylecow.Rule.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Rule'
		},

		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child, k) {
					child.toCode(code);
				});
			}
		}
	});

})(require('../index'));
