(function (stylecow) {
	var SourceMapGenerator = require('source-map').SourceMapGenerator;

	stylecow.Code = function (file) {
		this.indentStr = '';
		this.indent = [];
		this.column = 0;
		this.line = 1;
		this.code = '';

		if (file) {
			this.map = new SourceMapGenerator({
				file: file
			});
		}
	}

	stylecow.Code.prototype = {
		append: function (code, original) {
			if (this.map && original) {
				this.map.addMapping({
					generated: {
						line: this.line,
						column: this.column
					},
					source: original.getData('sourceFile'),
					original: {
						line: original.getData('sourceLine'),
						column: original.getData('sourceColumn')
					},
					name: code
				});
			}

			for (var i = 0, l = code.length; i < l; i++) {
				this.code += code[i];

				if (code[i] === '\n') {
					++this.line;
					this.code += this.indentStr;
					this.column = this.indentStr.length;
				} else {
					++this.column;
				}
			}
		},
		pushIndent: function (code) {
			this.indent.push(code);
			this.indentStr = this.indent.join('');
		},
		popIndent: function () {
			this.indent.pop();
			this.indentStr = this.indent.join('');
		}
	};

})(require('./index'));
