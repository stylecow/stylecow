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
				this.name = reader.seekAndFetch(' ').slice(1);

				switch (this.name) {
					case 'counter-style':
					case 'font-feature-values':
					case 'keyframes':
						return parseWithKeyword(this, reader);

					case 'document':
					case 'page':
					case 'region':
						return parseWithSelector(this, reader);

					case 'media':
					case 'supports':
						return parseWithMediaQueries(this, reader);

					default:
						reader.seekAndFetch('{');
						this.add(new stylecow.Block()).parse(reader);
				}
			}
		}
	});

	function parseWithKeyword (parent, reader) {
		reader.trim();

		parent.add(new stylecow.Keyword()).parse(reader);
		reader.seekAndFetch('{');
		parent.add(new stylecow.Block()).parse(reader);
	}

	function parseWithSelector (parent, reader) {
		reader.trim();

		parent.add(new stylecow.Selectors()).parse(reader);
		parent.add(new stylecow.Block()).parse(reader);
	}

	function parseWithMediaQueries (parent, reader) {
		reader.trim();

		parent.add(new stylecow.MediaQueries()).parse(reader);
		parent.add(new stylecow.Block()).parse(reader);
	}

})(require('../index'));
