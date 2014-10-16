(function (stylecow) {

	stylecow.Page = function () {
		this.type = 'Page';
	};

	stylecow.Page.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				var code = stylecow.Rule.prototype.toString.call(this);

				return code ? '@page ' + code : '';
			}
		},

		toCode: {
			value: function () {
				var code = stylecow.Rule.prototype.toCode.call(this);

				return code ? '@page ' + code : '';
			}
		}
	});
})(require('../index'));
