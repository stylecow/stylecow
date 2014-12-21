(function (stylecow) {

	stylecow.AtRule = function () {};

	stylecow.AtRule.createFromString = function (string) {
		return stylecow.AtRule.create(new stylecow.Reader(string));
	};

	stylecow.AtRule.create = function (reader) {
		var element = reader.setData(new stylecow.AtRule());

        element.name = reader.seek(' ').slice(1);

		switch (element.name) {
			case 'counter-style':
			case 'font-feature-values':
			case 'keyframes':
				element.push(stylecow.Keyword.create(reader));
				reader.seek('{');
				element.push(stylecow.Block.create(reader));
				break;

			case 'document':
			case 'page':
			case 'region':
				element.push(stylecow.Selectors.create(reader));
				element.push(stylecow.Block.create(reader));
				break;

			case 'media':
			case 'supports':
				element.push(stylecow.MediaQueries.create(reader));
				element.push(stylecow.Block.create(reader));
				break;

			case 'import':
				reader.addBreakChar(';');
				reader.execute(function () {
					if (reader.isFunction()) {
						return element.push(stylecow.Function.create(reader));
					}

					if (reader.isString()) {
						var value = new stylecow.Value();
						value.push(new stylecow.String.create(reader));

						var fn = new stylecow.Function();
						fn.name = 'url';
						fn.push(value);

						return element.push(fn);
					}
				});
				break;

			case 'charset':
				reader.addBreakChar(';');
				reader.execute(function () {
					element.push(stylecow.String.create(reader));
				});
				break;

			case 'namespace':
				reader.addBreakChar(';');
				reader.execute(function () {
					if (reader.isFunction()) {
						return element.push(stylecow.Function.create(reader));
					}

					element.push(stylecow.Keyword.create(reader));
				});
				break

			default:
				reader.seek('{');
				element.push(stylecow.Block.create(reader));
		}

        return element;
	};


	stylecow.AtRule.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'AtRule'
		},

		vendor: {
			set: function (value) {
				this._vendor = value;

				if (value) {
					this.cleanVendors();
				}
			},
			get: function () {
				if (this._vendor) {
					return this._vendor;
				}

				var key = this.firstChild({vendor: true});

				if (key) {
					return key.vendor;
				}
			}
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

				var vendor = name.match(/^\-(\w+)\-/);
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
		}
	});
})(require('../index'));
