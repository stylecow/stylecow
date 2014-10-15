(function (stylecow) {

	stylecow.Import = function (url) {
		this.type = 'Import';
		this.url = url;
	};

	stylecow.Import.prototype = Object.create(stylecow.Base, {
		clone: {
			value: function () {
				return new stylecow.Import(this.url);
			}
		},

		toString: {
			value: function () {
				return '@import "' + this.url + '"';
			}
		},

		toCode: {
			value: function () {
				return this.toString() + stylecow.codeStyle.ruleEnd;
			}
		}
	});
})(require('../index'));
