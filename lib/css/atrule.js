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
				return '@' + this.name + ' ' + this.join(' ') + (this.firstChild({type: 'Block'}) ? '' : ';');
			}
		},

		parse: {
			value: function (reader) {
				this.name = reader.seek(' ').slice(1);

				switch (this.name) {
					case 'counter-style':
					case 'font-feature-values':
					case 'keyframes':
						this.add(new stylecow.Keyword()).parse(reader);
						reader.seek('{');
						this.add(new stylecow.Block()).parse(reader);
						break;

					case 'document':
					case 'page':
					case 'region':
						this.add(new stylecow.Selectors()).parse(reader);
						this.add(new stylecow.Block()).parse(reader);
						break;

					case 'media':
					case 'supports':
						this.add(new stylecow.MediaQueries()).parse(reader);
						this.add(new stylecow.Block()).parse(reader);
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
						this.add(new stylecow.Block()).parse(reader);
				}
			}
		}
	});

	function parseUrl (reader) {
		if (reader.isFunction()) {
			return this.add(new stylecow.Function()).parse(reader);
		}

		if (reader.isString()) {
			var fn = new stylecow.Function();
			fn.name = 'url';
			return this.add(fn).add(new stylecow.Value()).add(new stylecow.String()).parse(reader);
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
