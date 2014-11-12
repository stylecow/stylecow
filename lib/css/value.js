(function (stylecow) {

	stylecow.Value = function () {
		this.type = 'Value';
	};

	stylecow.Value.prototype = Object.create(stylecow.Argument.prototype);
})(require('../index'));
