(function (stylecow) {

	stylecow.Function = function (name) {
		this.class = 'Function';
		this.type = 'Function';
		
		if (name) {
			this.name = name;
		}
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

		toString: {
			value: function () {
				return this.name + '(' + this.join(', ') + ')';
			}
		},

		parse: {
			value: function (reader) {
				this.name = reader.seek('(');
				reader.executeUntil(')', parseChild, this);
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
