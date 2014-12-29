(function (stylecow) {

	stylecow.Rule = function () {};

	stylecow.Rule.createFromString = function (string) {
		return stylecow.Rule.create(new stylecow.Reader(string));
	};

	stylecow.Rule.create = function (reader) {
		var element = reader.setData(new stylecow.Rule());

        element.push(stylecow.Selectors.create(reader));
        element.push(stylecow.Block.create(reader));

		return element;
	};

	stylecow.Rule.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Rule'
		},

		vendor: {
			set: function (value) {
				this._vendor = value;
			},
			get: function () {
				if (this._vendor) {
					return this._vendor;
				}

				var child = this.children(function () {
					return this.type !== 'Block';
				}).searchFirst(function () {
					return this._vendor;
				});

				if (child) {
					return child._vendor;
				}
			}
		},

		getContextVendor: {
			value: function () {
				var child = this.children(function () {
					return this.type !== 'Block';
				}).searchFirst(function () {
					return this._vendor;
				});

				if (child) {
					return child._vendor;
				}
			}
		},

		toString: {
			value: function () {
				return this.join(' ');
			}
		},

		toCode: {
			value: function (code) {
				this.forEach(function (child, k) {
					child.toCode(code);
				});
			}
		}
	});

})(require('../index'));
