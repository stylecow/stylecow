(function (stylecow) {

	stylecow.NestedAtRule = function () {
		this.class = 'NestedAtRule';
		this.type = 'AtRule';
	};

	stylecow.NestedAtRule.prototype = Object.create(stylecow.Base, {
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
				return '@' + this.name + ' ' + this.join(' ');
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

					default:
						reader.seek('{');
						this.add(new stylecow.Block()).parse(reader);
				}
			}
		}
	});

})(require('../index'));
