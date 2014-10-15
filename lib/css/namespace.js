(function (stylecow) {

	stylecow.Namespace = function (url, name) {
		this.type = 'Namespace';
		this.url = url;
		this.name = name;
	};

	stylecow.Namespace.prototype = Object.create(stylecow.Base, {
		clone: {
			value: function () {
				return new stylecow.Namespace(this.url, this.name);

				this.forEach(function (child) {
					var childClone = child.clone();
					childClone.parent = clone;

					clone.push(childClone);
				});
				
				return clone;
			}
		},

		toString: {
			value: function () {
				return '@namespace ' + (this.name ? this.name + ' ' : '') + 'url(' + this.url + ')';
			}
		},

		toCode: {
			value: function () {
				return this.toString() + stylecow.codeStyle.ruleEnd;
			}
		}
	});
})(require('../index'));
