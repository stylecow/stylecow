(function (css) {

	css.Keyword = function (name) {
		this.type = 'Keyword';
		this.name = name;
	};

	css.Keyword.create = function (string) {
		return new css.Keyword(string);
	};

	css.Keyword.prototype = Object.create(css.Base, {

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
})(require('../css'));
