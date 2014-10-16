(function (stylecow) {

	stylecow.Fontface = function () {
		this.type = 'Fontface';
	};

	stylecow.Fontface.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				var code = stylecow.Root.prototype.toString.call(this);

				return code ? '@font-face ' + code : '';
			}
		},

		toCode: {
			value: function () {
				var code = stylecow.Root.prototype.toCode.call(this);

				return code ? '@font-face ' + code : '';
			}
		}
	});
})(require('../index'));
