(function (stylecow) {

	stylecow.Value = function () {
		this.type = 'Value';
	};

	stylecow.Value.prototype = Object.create(stylecow.Base, {

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
