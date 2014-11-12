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
						declaration.empty().push(value);
					} else if (!declaration.search({type: 'Keyword', name: filter}).length) {
						declaration.push(value);
					}
				} else {
					this.add(new stylecow.Declaration('-ms-filter')).add(value);
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
			value: function (code) {
				var latest;
				var selectors = [];
				var content = [];

				this.forEach(function (child) {
					if (child.type === 'Selector') {
						selectors.push(child);
					} else {
						content.push(child);
					}
				});

				latest = selectors.length - 1;

				selectors.forEach(function (child, k) {
					child.toCode(code);

					if (k !== latest) {
						code.append(stylecow.codeStyle.selectorJoiner);
					}
				});

				code.pushIndent(stylecow.codeStyle.indent);
				code.append(stylecow.codeStyle.rulesetStart);

				latest = content.length - 1;

				content.forEach(function (child, k) {
					child.toCode(code);
					
					if (k !== latest) {
						code.append(stylecow.codeStyle.linebreak);
					}
				});

				code.popIndent();
				code.append(stylecow.codeStyle.rulesetEnd);
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

	function appendCode (info, code) {
		for (var i = 0, l = code.length; i < l; i++) {
			info.code += code[i];

			if (code[i] === "\n") {
				++info.line;
				info.column = 0;
			} else {
				++info.column;
			}
		}
	}

})(require('../index'));
