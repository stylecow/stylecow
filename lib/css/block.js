(function (stylecow) {

	stylecow.Block = function () {};

	stylecow.Block.createFromString = function (string) {
		return stylecow.Block.create(new stylecow.Reader(string));
	};

	stylecow.Block.create = function (reader) {
		var element = reader.setData(new stylecow.Block());

		reader.addBreakChar('}', true);

		reader.execute(function () {
			if (reader.isComment()) {
				return element.push(stylecow.Comment.create(reader));
			}

			if (reader.isAtRule()) {
				return element.push(stylecow.AtRule.create(reader));
			}

			if (reader.isNested()) {
				return element.push(stylecow.Rule.create(reader));
			}

			element.push(stylecow.Declaration.create(reader));
		});

		return element;
	};

	stylecow.Block.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Block'
		},

		toString: {
			value: function () {
				return "{\n" + "\t" + this.join("\n").replace(/\n/g, '\n' + "\t") + "\n}";
			}
		},

		toCode: {
			value: function (code) {
				code.pushIndent(code.style.indent);
				code.append(code.style.rulesetStart);

				latest = this.length - 1;

				this.forEach(function (child, k) {
					child.toCode(code);
					
					if (k !== latest) {
						code.append(code.style.linebreak);
					}
				});

				code.popIndent();
				code.append(code.style.rulesetEnd);
			}
		}
	});
})(require('../index'));
