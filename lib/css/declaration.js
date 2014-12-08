(function (stylecow) {

	stylecow.Declaration = function (name) {
		this.class = 'Declaration';
		this.type = 'Declaration';
		
		if (name) {
			this.name = name;
		}
	};

	stylecow.Declaration.prototype = Object.create(stylecow.Base, {

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
				this.name = reader.seekAndFetch(':');
				reader.trim();

				reader.run(this, parseChild, ';');
			}
		}
	});

	function parseChild (parent, reader) {
		if (reader.isComment()) {
			return parent.add(new stylecow.Comment()).parse(reader);
		}

		return parent.add(new stylecow.Value()).parse(reader);
	}
})(require('../index'));
