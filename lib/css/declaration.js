(function (stylecow) {

	stylecow.Declaration = function () {};

	stylecow.Declaration.createFromString = function (string) {
		return stylecow.Declaration.create(new stylecow.Reader(string));
	};

	stylecow.Declaration.create = function (reader) {
		var element = reader.setData(new stylecow.Declaration());

		element.name = reader.seek(':');

		reader.addBreakChar(';');

		reader.execute(function () {
			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			return element.push(stylecow.Value.create(reader));
		});

		return element;
	};

	stylecow.Declaration.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Declaration'
		},

		vendor: {
			set: function (value) {
				this._vendor = value;
			},
			get: function () {
				if (this._vendor) {
					return this._vendor;
				}

				var child = this.searchFirst(function () {
					return this._vendor;
				});

				if (child) {
					return child._vendor;
				}
			}
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
		}
	});
})(require('../index'));
