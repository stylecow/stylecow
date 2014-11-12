(function (stylecow) {

	stylecow.Selector = function () {
		this.type = 'Selector';
	};

	stylecow.Selector.prototype = Object.create(stylecow.Base, {
		toString: {
			value: function () {
				return this.join('');
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child) {
					child.toCode(code);
				});
			}
		}
	});
})(require('../index'));
