(function (stylecow) {

	stylecow.Charset = function (name) {
		this.type = 'Charset';
		this.name = name;
	};

	stylecow.Charset.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				return '@charset "' + this.name + '"';
			}
		},

		toCode: {
			value: function () {
				return this.toString() + stylecow.codeStyle.ruleEnd;
			}
		}
	});
})(require('../index'));
