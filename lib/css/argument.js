(function (stylecow) {

	stylecow.Argument = function () {
		this.type = 'Argument';
	};

	stylecow.Argument.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this.join(' ');
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../index'));
