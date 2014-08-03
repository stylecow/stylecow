(function (css) {
	var utils = require('../utils');

	css.Declaration = function (name, value) {
		this.type = 'Declaration';
		this.name = name;
		this.value = value;
	};

	css.Declaration.create = function (string) {
		var pieces = utils.explodeTrim(':', string, 2);

		if (pieces[1].substr(-1) === ';') {
			pieces[1] = pieces[1].slice(0, -1);
		}

		return new css.Declaration(pieces[0], pieces[1]);
	};

	css.Declaration.prototype = Object.create(css.Base, {

		parseChild: {
			value: function (string) {
				var value = css.Value.create(string);

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
				if (name[0] === '*' || name[0] === '_') {
					this.vendor = 'ms';
				} else {
					var vendor = name.match(/^\-(\w+)\-/);
					this.vendor = vendor ? vendor[0] : null;
				}

				this._name = name;
			}
		},

		value: {
			get: function () {
				return this.join(',');
			},
			set: function (value) {
				this.content = utils.explodeTrim(',', value);
			}
		},

		toString: {
			value: function () {
				return this.name + ': ' + this.join(', ') + ';';
			}
		},

		toCode: {
			value: function (style) {
				var value = this.map(function (child) {
					return child.toCode(style);
				}).join(style.valueJoiner);

				if (this.name === '-ms-filter') {
					value = "'" + value + "'";
				}

				return this.name + style.ruleColon + value + style.ruleEnd;
			}
		}
	});
})(require('../css'));
