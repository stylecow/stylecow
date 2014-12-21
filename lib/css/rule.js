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
