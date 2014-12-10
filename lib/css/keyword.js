(function (stylecow) {

	stylecow.Keyword = function (name) {
		this.class = 'Keyword';
		this.type = 'Keyword';
		
		if (name) {
			this.name = name;
		}
	};

	stylecow.Keyword.prototype = Object.create(stylecow.Base, {

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
				return this._name;
			}
		},

		parse: {
			value: function (reader) {
				this.name = reader.seek(' ');
			}
		}
	});
})(require('../index'));
