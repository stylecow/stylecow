(function (stylecow) {

	stylecow.Function = function (name) {
		this.type = 'Function';
		this.name = name;
	};

	stylecow.Function.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				var vendor = name.match(/^([:]+)?\-(\w+)\-/);
				this.vendor = vendor ? vendor[0] : null;
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
				return this.name + '(' + this.join(', ') + ')';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.name + '(', this);

				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(code.style.argumentJoiner);
					}
				});

				code.append(')');
			}
		}
	});
})(require('../index'));
