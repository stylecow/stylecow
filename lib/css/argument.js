(function (stylecow) {

	stylecow.Argument = function () {
		this.type = 'Argument';
	};

	stylecow.Argument.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				return this.join(' ');
			}
		}
	});
})(require('../index'));
