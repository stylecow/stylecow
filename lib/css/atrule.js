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
			value: function (code) {
				code.append('@' + this._name + ' ', this);

				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(stylecow.codeStyle.valueJoiner);
					}
				});

				code.append(stylecow.codeStyle.ruleEnd);
			}
		}
	});

})(require('../index'));
