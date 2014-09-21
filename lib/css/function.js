(function (stylecow) {

	stylecow.Function = function (name, args) {
		this.type = 'Function';
		this.name = name;
		this.content = args;
	};

	stylecow.Function.create = function (string) {
		var matches = string.match(/^([\w\.\:-]+)\((.*)\)$/);

		return new stylecow.Function(matches[1], stylecow.utils.explodeTrim(',', matches[2]));
	};

	stylecow.Function.prototype = Object.create(stylecow.Base, {

		parseChild: {
			value: function (string) {
				var value = stylecow.Value.create(string);

				if (value.length === 1) {
					return value[0];
				}

				return value;
			}
		},

		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				var vendor = name.match(/^([:]+)?\-(\w+)\-/);
				this.vendor = vendor ? vendor[0] : null;
				this._name = name;
			}
		},

		toString: {
			value: function () {
				return this.name + '(' + this.join(', ') + ')';
			}
		},

		toCode: {
			value: function (style) {
				return this.name + '(' + this.map(function (child) {
					return child.toCode(style);
				}).join(style.argumentJoiner) + ')';
			}
		}
	});
})(require('../index'));
