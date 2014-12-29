(function (stylecow) {
	var SourceMapGenerator = require('source-map').SourceMapGenerator;
	var sourceMapTransfer = require('multi-stage-sourcemap').transfer;
	var fs = require('fs');
	var path = require('path');

	stylecow.Coder = function (css, options) {
		options = options || {};

		this.file = options.file || '';
		this.sourceMap = options.sourceMap;
		this.indentStr = '';
		this.indent = [];
		this.column = 1;
		this.line = 1;
		this.code = '';
		this.map = false;
		this.style = stylecow.Coder.styles[options.style || 'normal'];

		if (!this.style) {
			throw new stylecow.Error('Code style not valid', {
				style: options.style
			});
		}

		if (this.sourceMap) {
			if (this.sourceMap === 'embed' || this.sourceMap === true) {
				this.sourceMapRoot = path.dirname(this.file);
			} else {
				this.sourceMapRoot = path.dirname(this.sourceMap);
			}

			this.map = new SourceMapGenerator({
				file: path.relative(this.sourceMapRoot, this.file),
				root: path.resolve(stylecow.cwd(), path.dirname(this.sourceMapRoot))
			});

			//find the previous sourceMap for multi-level source maps
			if (options.previousSourceMap === undefined) {
				var comment = css.firstChild({
					type: 'Comment',
					name: /^[#@]\ssourceMappingURL=/
				});

				if (comment) {
					var inlineSourceMap = comment.name.split('sourceMappingURL=')[1].trim();
					comment.remove();

					if (inlineSourceMap.indexOf('data:application/json;base64,') === 0) {
						options.previousSourceMap = JSON.parse((new Buffer(inlineSourceMap.substr(29), 'base64')).toString());
					} else {
						var rel = path.resolve(stylecow.cwd(), path.dirname(css.getData('sourceFile')) || '');
						options.previousSourceMap = JSON.parse(fs.readFileSync(path.resolve(rel, inlineSourceMap)));
					}
				}
			}

			css.toCode(this);

			if (options.previousSourceMap) {
				this.map = JSON.parse(sourceMapTransfer({
					fromSourceMap: this.map.toString(),
					toSourceMap: options.previousSourceMap
				}));
			} else {
				this.map = this.map.toJSON();
			}

			if (this.sourceMap === 'embed') {
				this.code += '\n/*# sourceMappingURL=data:application/json;base64,' + (new Buffer(JSON.stringify(this.map))).toString('base64') + ' */\n';
			} else if (typeof this.sourceMap === 'string') {
				this.code += '\n/*# sourceMappingURL=' + path.relative(path.dirname(this.file), this.sourceMap) + ' */\n';
			}
		} else {
			css.toCode(this);
		}
	}

	stylecow.Coder.styles = {
		"normal": {
			"indent": "\t",
			"linebreak": "\n",
			"selectorJoiner": ", ",
			"argumentJoiner": ", ",
			"valueJoiner": ", ",
			"ruleColon": ": ",
			"ruleEnd": ";",
			"comments": "all", // (all|important|none)
			"commentStart": "\n/*",
			"commentEnd": "*/\n",
			"rulesetStart": " {\n",
			"rulesetEnd": "\n}\n"
		},
		"minify": {
			"indent": "",
			"linebreak": "",
			"selectorJoiner": ",",
			"argumentJoiner": ",",
			"valueJoiner": ",",
			"ruleColon": ":",
			"ruleEnd": ";",
			"comments": "none",
			"commentStart": "/*",
			"commentEnd": "*/",
			"rulesetStart": "{",
			"rulesetEnd": "}"
		}
	};

	stylecow.Coder.prototype = {
		save: function () {
			save(this.file, this.code);

			if ((typeof this.sourceMap === 'string') && this.sourceMap !== 'embed') {
				save(this.sourceMap, JSON.stringify(this.map));
			}
		},
		append: function (code, original) {
			if (this.map && original) {
				this.map.addMapping({
					generated: {
						line: this.line,
						column: this.column
					},
					source: path.relative(this.sourceMapRoot, original.getData('sourceFile')),
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
		file = path.resolve(stylecow.cwd(), file);

		var dir = path.dirname(file);

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		fs.writeFileSync(file, content);
	}

})(require('./index'));
