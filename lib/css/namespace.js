(function (stylecow) {

	stylecow.Namespace = function (url, name) {
		this.type = 'Namespace';
		this.url = url;
		this.name = name;
	};

	stylecow.Namespace.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				return '@namespace ' + (this.name ? this.name + ' ' : '') + 'url(' + this.url + ')';
			}
		},

		toCode: {
			value: function () {
				return this.toString() + stylecow.codeStyle.ruleEnd;
			}
		}
	});
})(require('../index'));
