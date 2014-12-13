(function (stylecow) {

	stylecow.Function = function () {};

	stylecow.Function.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Function'
		},

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
		},

		parse: {
			value: function (reader) {
				this.name = reader.seek('(');

				reader.breakOn(')', true);
				reader.execute(parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return reader.parse(this, new stylecow.Comment());
		}

		reader.parse(this, new stylecow.Value());
	}
})(require('../index'));
