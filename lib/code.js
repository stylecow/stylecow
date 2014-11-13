(function (stylecow) {
	var SourceMapGenerator = require('source-map').SourceMapGenerator;
	var fs = require('fs');
	var path = require('path');

	stylecow.Code = function (css, options) {
		options = options || {};

		this.indentStr = '';
		this.indent = [];
		this.column = 0;
		this.line = 1;
		this.code = '';
		this.output = options.output;
		this.map = false;
		this.sourceMap = '';

		if (options.sourceMap) {
			if (options.sourceMap === true) {
				this.sourceMap = options.output.replace('.css', '.map');
			} else {
				this.sourceMap = options.sourceMap;
			}

			this.map = new SourceMapGenerator({
				file: this.output,
				root: sourceRoot
			});
		}

		css.toCode(this);

		if (this.sourceMap) {
			this.code += '\n/*# sourceMappingURL=' + this.sourceMap + ' */\n';
		}
	}

	stylecow.Code.prototype = {
		getCode: function () {
			return this.code;
		},
		getSourceMap: function () {
			return this.map.toString();
		},
		save: function () {
			save(this.output, this.getCode());

			if (this.sourceMap) {
				save(this.sourceMap, this.getSourceMap());
			}
		},
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

	function save (file, content) {
		file = path.resolve(stylecow.cd, file);

		var dir = path.dirname(file);

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		fs.writeFileSync(file, content);
	}

})(require('./index'));
