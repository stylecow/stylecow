(function (stylecow) {

	stylecow.Selector = function (name) {
		this.type = 'Selector';
		//this.name = name;
	};

	stylecow.Selector.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this.join('');
			},
			set: function (name) {
				this.content = stylecow.utils.parseSelector(name);
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		},

		toCode: {
			value: function () {
				return this.map(function (child) {
					return child.toCode();
				}).join('');
			}
		}
	});
})(require('../index'));
