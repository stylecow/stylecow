(function (stylecow) {

	stylecow.Keyframes = function (name) {
		this.type = 'Keyframes';
		this.name = name;
	};

	stylecow.Keyframes.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				var code = stylecow.Rule.prototype.toString.call(this);

				return code ? '@keyframes ' + this.name + code : '';
			}
		},

		toCode: {
			value: function () {
				var code = stylecow.Rule.prototype.toCode.call(this);

				return code ? '@keyframes ' + this.name + code : '';
			}
		}
	});
})(require('../index'));
