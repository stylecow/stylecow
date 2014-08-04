(function (css) {
	var utils = require('../utils');

	css.AtRule = function (name) {
		this.type = 'AtRule';
		this.name = name;
	};

	css.AtRule.create = function (string) {
		return css.Rule.create(string);
	};

	css.AtRule.prototype = Object.create(css.Rule.prototype, {

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
				var code = css.Rule.prototype.toString.call(this);

				return code ? ('@' + this.name + ' ' + code) : '';
			}
		},

		toCode: {
			value: function (style) {
				var code = css.Rule.prototype.toCode.call(this, style);

				return code ? ('@' + this.name + ' ' + code) : '';
			}
		}
	});
})(require('../css'));
