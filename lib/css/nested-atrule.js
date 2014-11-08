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
			value: function () {
				var stringIn = [];
				var stringOut = [];
				var conditions = [];
				var selectors = [];

				this.forEach(function (child) {
					var string = child.toCode();

					if (string) {
						if (child.type === 'Selector') {
							selectors.push(string);
						} else if (child.type === 'Condition') {
							conditions.push(string);
						} else if (child.type === 'Value') {
							stringOut.push(string);
						} else {
							stringIn.push(string);
						}
					}
				});

				if (!stringIn.length) {
					return '';
				}

				if (selectors.length) {
					stringOut.push(selectors.join(stylecow.codeStyle.selectorJoiner));
				}

				if (conditions.length) {
					stringOut.push(conditions.join(' '));
				}

				stringIn = arrayUnique(stringIn).join(stylecow.codeStyle.linebreak);
				stringOut = stringOut.join(' ');

				if (stringOut) {
					stringOut = ' ' +  stringOut;
				}

				if (stylecow.codeStyle.indent) {
					stringIn = stylecow.codeStyle.indent + stringIn.replace(/\n/g, '\n' + stylecow.codeStyle.indent);
				}

				return '@' + this._name + stringOut + stylecow.codeStyle.rulesetStart + stringIn + stylecow.codeStyle.rulesetEnd;
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
