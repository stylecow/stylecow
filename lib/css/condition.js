(function (stylecow) {

	stylecow.Condition = function (name) {
		this.type = 'Condition';
		this.name = name;
	};

	stylecow.Condition.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				return this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.name, this);
			}
		}
	});
})(require('../index'));
