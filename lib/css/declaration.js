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
			return this.add(new stylecow.Comment()).parse(reader);
		}

		return this.add(new stylecow.Value()).parse(reader);
	}
})(require('../index'));
