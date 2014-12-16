(function (stylecow) {

	stylecow.Keyword = function () {};

	stylecow.Keyword.createFromString = function (string) {
		return stylecow.Keyword.create(new stylecow.Reader(string));
	};

	stylecow.Keyword.create = function (reader) {
		var element = reader.setData(new stylecow.Keyword());

		element.name = reader.seek(' ');

		return element;
	};

	stylecow.Keyword.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Keyword'
		},

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				this.vendor = null;

				if (name[0] === '-') {
					var vendor = name.match(/^\-(\w+)\-/);
					this.vendor = vendor ? vendor[0] : null;
				}

				this._name = name;
			}
		},

		toString: {
			value: function () {
				return this.name;
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.name, this);
			}
		}
	});
})(require('../index'));
