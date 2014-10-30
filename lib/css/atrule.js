(function (stylecow) {

	stylecow.AtRule = function (name) {
		this.type = 'AtRule';
		this.name = name;
	};

	stylecow.AtRule.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				if (name[0] === '@') {
					name = name.substr(1);
				}

				var vendor = name.match(/^@\-(\w+)\-/);
				this.vendor = vendor ? vendor[0] : null;
				this._name = name;
			}
		},

		toString: {
			value: function () {
				return '@' + this._name + ' ' + this.join(' ') + ';';
			}
		},

		toCode: {
			value: function () {
				var value = this.map(function (child) {
					return child.toCode();
				}).join(stylecow.codeStyle.valueJoiner);

				return value ? ('@' + this._name + ' ' + value + stylecow.codeStyle.ruleEnd) : '';
			}
		}
	});

})(require('../index'));
