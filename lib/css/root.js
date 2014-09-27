(function (stylecow) {

	stylecow.Root = function () {
		this.type = 'Root';
	};

	stylecow.Root.create = function (string) {
		return stylecow.utils.parseCode(string, new stylecow.Root());
	};

	stylecow.Root.prototype = Object.create(stylecow.Base, {

		parseChild: {
			value: function (string) {
				return stylecow.utils.parseCode(string)[0];
			}
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
			value: function () {
				return this.map(function (child) {
					return child.toCode();
				}).filter(function (string) {
					return string ? true : false;
				}).join(stylecow.codeStyle.linebreak);
			}
		}
	});
})(require('../index'));
