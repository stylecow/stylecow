(function (stylecow) {

	stylecow.Expression = function (name) {
		this.type = 'Expression';
		this.name = name;
	};

	stylecow.Expression.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				return '(' + this.name + ')';
			}
		}
	});
})(require('../index'));
