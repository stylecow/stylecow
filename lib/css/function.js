(function (stylecow) {

	stylecow.Function = function () {};

	stylecow.Function.createFromString = function (string) {
		return stylecow.Function.create(new stylecow.Reader(string));
	};

	stylecow.Function.create = function (reader) {
		var element = reader.setData(new stylecow.Function());

		element.name = reader.seek('(');

		reader.addBreakChar(')', true);

		reader.execute(function () {
			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			element.push(stylecow.Value.create(reader));
		});

		return element;
	};

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

				this.vendor = null;

				if (name[0] === '-' || name[0] === ':') {
					var vendor = name.match(/^:*(\-(\w+)\-)/);
					this.vendor = vendor ? vendor[1] : null;
				}

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
		}
	});
})(require('../index'));
