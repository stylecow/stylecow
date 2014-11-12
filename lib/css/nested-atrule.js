(function (stylecow) {

	stylecow.NestedAtRule = function (name) {
		this.type = 'NestedAtRule';
		this.name = name;
	};

	stylecow.NestedAtRule.prototype = Object.create(stylecow.AtRule.prototype, {

		toString: {
			value: function () {
				var stringIn = [];
				var stringOut = [];
				var conditions = [];
				var selectors = [];

				this.forEach(function (child) {
					var string = child.toString();

					if (string) {
						if (child.type === 'Selector') {
							selectors.push(child);
						} else if (child.type === 'Condition') {
							conditions.push(child);
						} else if (child.type === 'Value') {
							stringOut.push(child);
						} else {
							stringIn.push(child);
						}
					}
				});

				if (selectors.length) {
					stringOut.push(selectors.join(', '));
				}

				if (conditions.length) {
					stringOut.push(conditions.join(' '));
				}

				stringOut = stringOut.join(' ');

				if (stringOut) {
					stringOut += ' ';
				}

				stringIn = "\t" + stringIn.join("\n").replace(/\n/g, '\n' + "\t");

				return '@' + this._name + ' ' + stringOut + "{\n" + stringIn + "\n}";
			}
		},

		toCode: {
			value: function (code) {
				var latest;
				var content = [];
				var conditions = [];
				var selectors = [];
				var values = [];

				code.append('@' + this._name, this);

				this.forEach(function (child) {
					if (child.type === 'Selector') {
						selectors.push(child);
					} else if (child.type === 'Condition') {
						conditions.push(child);
					} else if (child.type === 'Value') {
						values.push(child);
					} else {
						content.push(child);
					}
				});

				if (selectors.length) {
					code.append(' ');

					latest = selectors.length - 1;

					selectors.forEach(function (child, k) {
						child.toCode(code);

						if (k !== latest) {
							code.append(stylecow.codeStyle.selectorJoiner);
						}
					});
				}

				if (conditions.length) {
					conditions.forEach(function (child, k) {
						code.append(' ');
						child.toCode(code);
					});
				}

				if (values.length) {
					values.forEach(function (child, k) {
						code.append(' ');
						child.toCode(code);
					});
				}

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

})(require('../index'));
