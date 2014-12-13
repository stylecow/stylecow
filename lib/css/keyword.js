(function (stylecow) {

	stylecow.Keyword = function () {};

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
		},

		parse: {
			value: function (reader) {
				this.name = reader.seek(' ');
			}
		}
	});
})(require('../index'));
