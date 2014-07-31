(function (css) {
	var utils = require('../utils');

	css.Rule = function () {
		this.type = 'Rule';
	};

	css.Rule.create = function (string) {
		var root = css.parser.code(string);

		if (!root.length) {
			return new css.Rule();
		}

		return root[0];
	};

	css.Rule.prototype = Object.create(css.Base, {

		executePlugins: {
			value: function (plugins) {
				css.Root.prototype.executePlugins.call(this, plugins);
			}
		},

		parseChild: {
			value: function (string) {
				return css.Declaration.create(string);
			}
		},

		selector: {
			get: function () {
				return this.children('Selector').join(',');
			},
			set: function (selectors) {
				this.children('Selector').forEach(function (child) {
					child.remove();
				});

				utils.explodeTrim(',', selectors).forEach(function (selector, index) {
					this.add(css.Selector.create(selector), index);
				}, this);
			}
		},

		addOldMsFilter: {
			value: function (filter) {
				var declaration = this.children('Declaration', '-ms-filter').pop();

				if (declaration) {
					if (declaration.value === 'none') {
						declaration.value = filter;
					} else if (declaration.content.indexOf(filter) === -1) {
						declaration.append(filter);
					}
				} else {
					declaration = this.add(css.Declaration.create('-ms-filter:' + filter));
				}
			}
		},

		toString: {
			value: function () {
				var declarations = [];
				var selectors = [];

				this.forEach(function (child) {
					var string = child.toString();

					if (string) {
						if (child.is('Selector')) {
							selectors.push(child);
						} else {
							declarations.push(child);
						}
					}
				});

				declarations = "\t" + declarations.join("\n").replace(/\n/g, '\n' + "\t");

				return selectors.join(', ') + " {\n" + declarations + "\n}";
			}
		},

		toCode: {
			value: function () {
				var declarations = [];
				var selectors = [];

				this.forEach(function (child) {
					var string = child.toCode();

					if (string) {
						if (child.is('Selector')) {
							selectors.push(string);
						} else {
							declarations.push(string);
						}
					}
				});

				utils.arrayUnique(declarations);
				utils.arrayUnique(selectors);

				if (!declarations.length) {
					return '';
				}

				declarations = declarations.join(this.getData('linebreak'));

				var indent = this.getData('indent');

				if (indent) {
					declarations = indent + declarations.replace(/\n/g, '\n' + indent);
				}

				return selectors.join(this.getData('selectorJoiner')) + this.getData('rulesetStart') + declarations + this.getData('rulesetEnd');
			}
		}
	});
})(require('../css'));
