(function (stylecow) {

	stylecow.Rule = function () {
		this.type = 'Rule';
	};

	stylecow.Rule.create = function (string) {
		var root = stylecow.utils.parseCode(string);

		if (!root.length) {
			return new stylecow.Rule();
		}

		return root[0];
	};

	stylecow.Rule.prototype = Object.create(stylecow.Root.prototype, {

		selector: {
			get: function () {
				return this.children('Selector').join(',');
			},
			set: function (selectors) {
				this.children('Selector').forEach(function (child) {
					child.remove();
				});

				stylecow.utils.explodeTrim(',', selectors).forEach(function (selector, index) {
					this.add(stylecow.Selector.create(selector), index);
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
					declaration = this.add(stylecow.Declaration.create('-ms-filter:' + filter));
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
			value: function (style) {
				var declarations = [];
				var selectors = [];

				this.forEach(function (child) {
					var string = child.toCode(style);

					if (string) {
						if (child.is('Selector')) {
							selectors.push(string);
						} else {
							declarations.push(string);
						}
					}
				});

				declarations = stylecow.utils.arrayUnique(declarations);
				selectors = stylecow.utils.arrayUnique(selectors);

				if (!declarations.length) {
					return '';
				}

				declarations = declarations.join(style.linebreak);

				if (style.indent) {
					declarations = style.indent + declarations.replace(/\n/g, '\n' + style.indent);
				}

				return selectors.join(style.selectorJoiner) + style.rulesetStart + declarations + style.rulesetEnd;
			}
		}
	});
})(require('../index'));
