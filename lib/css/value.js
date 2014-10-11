(function (stylecow) {

	stylecow.Value = function (name) {
		this.type = 'Value';
		//this.name = name;
	};

	stylecow.Value.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this.join(' ');
			},
			set: function (name) {
				this.content = stylecow.utils.explodeTrim(' ', name);
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../index'));
