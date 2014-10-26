(function (stylecow) {

	stylecow.Declaration = function (name) {
		this.type = 'Declaration';
		this.name = name;
	};

	stylecow.Declaration.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				if (name[0] === '*' || name[0] === '_') {
					this.vendor = 'ms';
				} else if (name[0] === '-') {
					var vendor = name.match(/^\-(\w+)\-/);
					this.vendor = vendor ? vendor[0] : null;
				} else {
					this.vendor = null;
				}

				this._name = name;
			}
		},

		value: {
			get: function () {
				return this.join(', ');
			},
			set: function (value) {
				this.setValue(value);
			}
		},

		toString: {
			value: function () {
				return this.name + ': ' + this.join(', ') + ';';
			}
		},

		toCode: {
			value: function () {
				var value = this.map(function (child) {
					return child.toCode();
				}).join(stylecow.codeStyle.valueJoiner);

				if (this.name === '-ms-filter') {
					value = "'" + value + "'";
				}

				return this.name + stylecow.codeStyle.ruleColon + value + stylecow.codeStyle.ruleEnd;
			}
		}
	});
})(require('../index'));
