(function (stylecow) {

	stylecow.Argument = function (name) {
		this.type = 'Argument';
		//this.name = name;
	};

	stylecow.Argument.prototype = Object.create(stylecow.Value.prototype);
})(require('../index'));
