(function (stylecow) {

	stylecow.Keyword = function (name) {
		this.type = 'Keyword';
		this.name = name;
	};

	stylecow.Keyword.prototype = Object.create(stylecow.Base, {

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				this.vendor = null;
				this.quoted = false;

				if (name[0] === '"' || name[0] === "'") {
					this.quoted = true;
					name = name.slice(1, -1);
				} else if (name[0] === '-') {
					var vendor = name.match(/^\-(\w+)\-/);
					this.vendor = vendor ? vendor[0] : null;
				}

				this._name = name;
			}
		},

		toString: {
			value: function () {
				return this.quoted ? ('"' + this.name + '"') : this.name;
			}
		}
	});
})(require('../index'));
