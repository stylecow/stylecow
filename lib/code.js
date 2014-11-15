(function (stylecow) {
	var SourceMapGenerator = require('source-map').SourceMapGenerator;
	var sourceMapTransfer = require('multi-stage-sourcemap').transfer;
	var fs = require('fs');
	var path = require('path');

	stylecow.Code = function (css, options) {
		options = options || {};

		this.file = options.file;
		this.style = stylecow.Code.styles[options.style || 'normal'];
		this.sourceMapFile = options.sourceMapFile;
		this.sourceMapRoot = path.dirname(this.sourceMapFile ? this.sourceMapFile : this.file);

		this.indentStr = '';
		this.indent = [];
		this.column = 0;
		this.line = 1;
		this.code = '';
		this.map = false;

		if (options.sourceMap) {
			this.map = new SourceMapGenerator({
				file: path.relative(this.sourceMapRoot, this.file),
				root: path.resolve(stylecow.cwd(), path.dirname(this.sourceMapRoot))
			});

			//find the previous sourceMap for multi-level source maps
			var previousSourceMap, inlineSourceMap;

			css.children({type: 'Comment'}).forEach(function (comment) {
				if (!inlineSourceMap && comment.name.indexOf('sourceMappingURL=') !== -1) {
					inlineSourceMap = comment.name.split('sourceMappingURL=')[1].trim();
				}

				comment.remove();
			});

			if (inlineSourceMap) {
				if (inlineSourceMap.indexOf('data:application/json;base64,') === 0) {
					previousSourceMap = JSON.parse((new Buffer(inlineSourceMap.substr(29), 'base64')).toString());
				} else {
					var rel = path.resolve(stylecow.cwd(), path.dirname(css.getData('sourceFile')) || '');
					previousSourceMap = JSON.parse(fs.readFileSync(path.resolve(rel, inlineSourceMap)));
				}
			}
		}

		css.toCode(this);

		if (options.sourceMap) {
			if (previousSourceMap) {
				this.mapString = sourceMapTransfer({
					fromSourceMap: this.map.toString(),
					toSourceMap: previousSourceMap
				});
			} else {
				this.mapString = this.map.toString();
			}

			if (this.sourceMapFile) {
				this.code += '\n/*# sourceMappingURL=' + path.relative(path.dirname(this.file), this.sourceMapFile) + ' */\n';
			} else {
				this.code += '\n/*# sourceMappingURL=data:application/json;base64,' + (new Buffer(this.mapString)).toString('base64') + ' */\n';
			}
		}
	}

	stylecow.Code.styles = {
		"normal": {
			"indent": "\t",
			"linebreak": "\n",
			"selectorJoiner": ", ",
			"argumentJoiner": ", ",
			"valueJoiner": ", ",
			"ruleColon": ": ",
			"ruleEnd": ";",
			"comments": "all", // (all|important|none)
			"commentStart": "/*",
			"commentEnd": "*/",
			"rulesetStart": " {\n",
			"rulesetEnd": "\n}"
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

	stylecow.Code.prototype = {
		save: function () {
			save(this.file, this.code);

			if (this.sourceMapFile) {
				save(this.sourceMapFile, this.mapString);
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
