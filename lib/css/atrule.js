(function (stylecow) {

	stylecow.AtRule = function () {
		this.class = 'AtRule';
		this.type = 'AtRule';
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
				return '@' + this.name + ' ' + this.join(' ') + ';';
			}
		},

		parse: {
			value: function (reader) {
				this.name = reader.seek(' ').slice(1);

				switch (this.name) {
					case 'import':
						return reader.executeUntil(';', parseUrl, this);

					case 'charset':
						return reader.executeUntil(';', parseString, this);

					case 'namespace':
						return reader.executeUntil(';', parseFunction, this);
				}
			}
		}
	});

	function parseUrl (reader) {
		if (reader.isFunction()) {
			return this.add(new stylecow.Function()).parse(reader);
		}

		if (reader.isString()) {
			return this.add(new stylecow.Function('url')).add(new stylecow.Value()).add(new stylecow.String()).parse(reader);
		}
	}

	function parseString (reader) {
		return this.add(new stylecow.String()).parse(reader);
	}

	function parseFunction (reader) {
		if (reader.isFunction()) {
			return this.add(new stylecow.Function()).parse(reader);
		}

		return this.add(new stylecow.Keyword()).parse(reader);
	}

})(require('../index'));
