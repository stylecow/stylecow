(function (stylecow) {

	stylecow.Supports = function (name) {
		this.type = 'Supports';
		this.name = name;
	};

	stylecow.Supports.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				var code = stylecow.Rule.prototype.toString.call(this);

				return code ? '@supports ' + this.name + ' ' + code : '';
			}
		},

		toCode: {
			value: function () {
				var code = stylecow.Rule.prototype.toCode.call(this);

				return code ? '@supports ' + this.name + ' ' + code : '';
			}
		}
	});
})(require('../index'));
