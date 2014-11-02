(function (stylecow) {

	stylecow.Rule = function () {
		this.type = 'Rule';
	};

	stylecow.Rule.prototype = Object.create(stylecow.Root.prototype, {

		addOldMsFilter: {
			value: function (filter) {
				var declaration = this.children({type: 'Declaration', name: '-ms-filter'}).pop();

				var value = new stylecow.Value;
				value.add(new stylecow.Keyword(filter));

				if (declaration) {
					if (declaration.value === 'none') {
						declaration.setContent(value);
					} else if (!declaration.search({type: 'Keyword', name: filter}).length) {
						declaration.add(value);
					}
				} else {
					this.add(new stylecow.Declaration('-ms-filter')).setContent(value);
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
						if (child.is({type: 'Selector'})) {
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
						if (child.type === 'Selector') {
							selectors.push(string);
						} else {
							declarations.push(string);
						}
					}
				});

				declarations = arrayUnique(declarations);
				selectors = arrayUnique(selectors);

				if (!declarations.length) {
					return '';
				}

				declarations = declarations.join(stylecow.codeStyle.linebreak);

				if (stylecow.codeStyle.indent) {
					declarations = stylecow.codeStyle.indent + declarations.replace(/\n/g, '\n' + stylecow.codeStyle.indent);
				}

				return selectors.join(stylecow.codeStyle.selectorJoiner) + stylecow.codeStyle.rulesetStart + declarations + stylecow.codeStyle.rulesetEnd;
			}
		}
	});

	function arrayUnique (array) {
		var i, k, a = [];

		for (i = array.length - 1; i >= 0; i--) {
			k = a.indexOf(array[i]);

			if (k === -1) {
				a.unshift(array[i]);
			}
		}

		return a;
	}

})(require('../index'));
