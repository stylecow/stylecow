(function (stylecow) {

	stylecow.AtRule = function () {};

	stylecow.AtRule.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'AtRule'
		},

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
				return '@' + this.name + ' ' + this.join(' ') + (this.hasChild({type: 'Block'}) ? '' : ';');
			}
		},

		toCode: {
			value: function (code) {
				code.append('@' + this.name + ' ', this);

				this.forEach(function (child, k) {
					child.toCode(code);
				});

				if (!this.hasChild({type: 'Block'})) {
					code.append(code.style.ruleEnd);
				}
			}
		},

		parse: {
			value: function (reader) {
				this.name = reader.seek(' ').slice(1);

				switch (this.name) {
					case 'counter-style':
					case 'font-feature-values':
					case 'keyframes':
						reader.parse(this, new stylecow.Keyword());
						reader.seek('{');
						reader.parse(this, new stylecow.Block());
						break;

					case 'document':
					case 'page':
					case 'region':
						reader.parse(this, new stylecow.Selectors());
						reader.parse(this, new stylecow.Block());
						break;

					case 'media':
					case 'supports':
						reader.parse(this, new stylecow.MediaQueries());
						reader.parse(this, new stylecow.Block());
						break;

					case 'import':
						reader.breakOn(';');
						return reader.execute(parseUrl, this);

					case 'charset':
						reader.breakOn(';');
						return reader.execute(parseString, this);

					case 'namespace':
						reader.breakOn(';');
						return reader.execute(parseFunction, this);

					default:
						reader.seek('{');
						reader.parse(this, new stylecow.Block());
				}
			}
		}
	});

	function parseUrl (reader) {
		if (reader.isFunction()) {
			return reader.parse(this, new stylecow.Function());
		}

		if (reader.isString()) {
			var fn = new stylecow.Function();
			fn.name = 'url';

			return this.add(fn).add(new stylecow.Value()).add(reader.parse(this, new stylecow.String()));
		}
	}

	function parseString (reader) {
		reader.parse(this, new stylecow.String());
	}

	function parseFunction (reader) {
		if (reader.isFunction()) {
			return reader.parse(this, new stylecow.Function());
		}

		reader.parse(this, new stylecow.Keyword());
	}

})(require('../index'));
