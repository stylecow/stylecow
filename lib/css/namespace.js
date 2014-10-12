(function (stylecow) {

	stylecow.Namespace = function (url, prefix) {
		this.type = 'Namespace';
		this.url = url;
		this.prefix = prefix;
	};

	stylecow.Namespace.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				return '@namespace ' + (this.prefix ? this.prefix + ' ' : '') + 'url(' + this.url + ')';
			}
		},

		toCode: {
			value: function () {
				return this.toString() + stylecow.codeStyle.ruleEnd;
			}
		}
	});
})(require('../index'));
