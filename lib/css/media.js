(function (stylecow) {

	stylecow.Media = function (name) {
		this.type = 'Media';
		this.name = name;
	};

	stylecow.Media.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				var code = stylecow.Rule.prototype.toString.call(this);

				return code ? '@media ' + this.name + ' ' + code : '';
			}
		},

		toCode: {
			value: function () {
				var code = stylecow.Rule.prototype.toCode.call(this);

				return code ? '@media ' + this.name + ' ' + code : '';
			}
		}
	});
})(require('../index'));
