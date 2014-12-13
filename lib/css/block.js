(function (stylecow) {

	stylecow.Block = function () {};

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
		},

		parse: {
			value: function (reader) {
				reader.breakOn('}', true);
				reader.execute(parseChild, this);
			}
		}
	});

	function parseChild (reader) {
		if (reader.isComment()) {
			return reader.parse(this, new stylecow.Comment());
		}

		if (reader.isAtRule()) {
			return reader.parse(this, new stylecow.AtRule());
		}

		if (reader.isNested()) {
			return reader.parse(this, new stylecow.Rule());
		}

		reader.parse(this, new stylecow.Declaration());
	}
})(require('../index'));
