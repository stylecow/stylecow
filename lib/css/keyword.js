(function (stylecow) {

	stylecow.Keyword = function (name) {
		this.type = 'Keyword';
		this.name = name;
	};

	stylecow.Keyword.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				var vendor = name.match(/^\-(\w+)\-/);
				this.vendor = vendor ? vendor[0] : null;
				this._name = name;
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		}
	});
})(require('../index'));
