(function (stylecow) {

	stylecow.Declaration = function () {};

	stylecow.Declaration.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Declaration'
		},

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
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

		toString: {
			value: function () {
				return this.name + ': ' + this.join(', ') + ';';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.name + code.style.ruleColon, this);

				var latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(code.style.valueJoiner);
					}
				});

				code.append(code.style.ruleEnd);
			}
		},

		parse: {
			value: function (reader) {
				this.name = reader.seek(':');

				reader.breakOn(';');
				reader.execute(parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return reader.parse(this, new stylecow.Comment());
		}

		return reader.parse(this, new stylecow.Value());
	}
})(require('../index'));
