(function (stylecow) {
	var collapsedSpaces = [' ', '\t', '\n', '\r'];
	var collapsedSelector = collapsedSpaces.concat(['>', '~', '+', ',', '{']);
	var collapsedValue = collapsedSpaces.concat([',']);

	var types = {
		Argument: 'value',
		Charset: 'declaration',
		Comment: 'comment',
		Declaration: 'declaration',
		Fontface: 'rule',
		Function: 'function',
		Import: 'declaration',
		Keyword: 'keyword',
		Namespace: 'declaration',
		Page: 'rule',
		Root: 'rule',
		Rule: 'rule',
		Selector: 'selector',
		Value: 'value'
	};

	var Parser = function (code, parent) {
		this.code = code;
		this.parent = parent || new stylecow.Root();
	};

	Parser.prototype = {
		keyChars: ['{', '}', ':', ' ', '*', '.', '[', '#', '+', '>', '~', ';', '(', ')', ',', '/', '&'],

		run: function () {
			this.pos = 0;
			this.col = 0;
			this.line = 0;
			this.buffer = '';
			this.current = this.parent;
			this.currChar = '';
			this.length = this.code.length;
			this.currType = '';

			while (this.next()) {
				this.currType = types[this.current.type];

				if (this.skip()) {
					continue;
				}

				if (this.keyChars.indexOf(this.currChar) !== -1) {
					if (!this[this.currChar]()) {
						this.buffer += this.currChar;
					}
				} else {
					this.buffer += this.currChar;
				}
			}

			return this.parent;
		},

		next: function () {
			if (this.pos >= this.length) {
				return false;
			}

			this.currChar = this.code[this.pos];
			++this.pos;

			if (this.currChar === '\n') {
				++this.line;
				this.col = 0;
			} else {
				++this.col;
			}

			return true;
		},

		skip: function () {
			//Quotes
			if (this.currChar === '"' || this.currChar === "'") {
				var c = this.currChar;
				this.buffer += this.currChar;

				while (this.next()) {
					this.buffer += this.currChar;

					if (this.currChar === c) {
						break;
					}
				}

				return true;
			}

			switch (this.currType) {
				case 'selector':
				case 'rule':
					if (this.buffer.trim()) {
						this.collapse(collapsedSelector);
						return false;
					}
					break;

				case 'value':
					if (this.buffer.trim()) {
						this.collapse(collapsedValue);
						return false;
					}
					break;

			}

			if ((!this.buffer || this.currType !== 'declaration' || this.current.type && 'Declaration') && collapsedSpaces.indexOf(this.currChar) !== -1) {
				return true;
			}
		},

		collapse: function (validChars) {
			var c = this.currChar;

			if (validChars.indexOf(this.currChar) !== -1) {
				var next = this.code[this.pos];

				while (validChars.indexOf(next) !== -1) {
					c += next || '';
					this.next();
					next = this.code[this.pos];
				}

				this.currChar = c.trim() || ' ';
			}
		},

		'{': function () {
			if (this.currType === 'rule') {
				if (this.buffer) {
					switch (this.buffer) {
						case '@page':
							this.current = this.current.add(new stylecow.Page).add(new stylecow.Selector);
							this.buffer = '';
							return true;

						case '@font-face':
							this.current = this.current.add(new stylecow.Fontface);
							this.buffer = '';
							return true;
					}

					this.current = this.current.add(new stylecow.Rule);
					this.current.add(new stylecow.Selector).add(new stylecow.Keyword(this.buffer));
				}
				this.buffer = '';
				return true;
			}

			if (this.currType === 'selector') {
				if (this.buffer) {
					this.current.add(new stylecow.Keyword(this.buffer));
				}
				this.current = this.current.parent;
				this.buffer = '';
				return true;
			}
		},

		'}': function () {
			if (this.currType === 'rule') {
				this.current = this.current.parent;
				this.buffer = '';
				return true;
			}

			if (this.currType === 'declaration') {
				this.current = this.current.parent.parent;
				this.buffer = '';
				return true;
			}

			if (this.currType === 'value') {
				if (this.buffer) {
					this.current.add(new stylecow.Keyword(this.buffer));
				}
				this.current = this.current.parent.parent.parent;
				this.buffer = '';
				return true;
			}
		},

		':': function () {
			if (this.currType === 'rule') {
				var isNested = this.code.indexOf('{', this.pos);

				//Nested rule
				if (isNested !== -1 && isNested < this.code.indexOf(';', this.pos) && isNested < this.code.indexOf('}', this.pos)) {
					this.current = this.current.add(new stylecow.Rule).add(new stylecow.Selector);
					this.currType = types[this.current.type];

					return this[':']();
				}

				this.current = this.current.add(new stylecow.Declaration(this.buffer)).add(new stylecow.Value);
				this.buffer = '';
				return true;
			}

			if (this.buffer && this.buffer.substr(-1) !== ':') {
				return this.initSelectorKeyword();
			}
		},

		' ': function () {
			if (this.currType === 'value') {
				this.current.add(new stylecow.Keyword(this.buffer));
				this.buffer = '';
				return true;
			}

			if (this.currType === 'rule') {
				if (this.buffer[0] === '@') {
					switch (this.buffer) {
						case '@charset':
							this.current = this.current.add(new stylecow.Charset);
							this.buffer = '';
							return true;

						case '@import':
							this.current = this.current.add(new stylecow.Import);
							this.buffer = '';
							return true;

						case '@namespace':
							this.current = this.current.add(new stylecow.Namespace);
							this.buffer = '';
							return true;

						case '@page':
							this.current = this.current.add(new stylecow.Page).add(new stylecow.Selector);
							this.buffer = '';
							return true;
					}
				} else {
					return this.initSelectorOperator();
				}
			}

			if (this.currType === 'declaration') {
				this.current.prefix = this.buffer;
				this.buffer = '';
				return true;
			}
		},

		',': function () {
			if (this.currType === 'value') {
				this.current.add(new stylecow.Keyword(this.buffer));
				this.current = this.current.parent.add(new stylecow[this.current.type]);
				this.buffer = '';
				return true;
			}

			if (this.currType === 'rule' || this.currType === 'selector') {
				this.initSelectorKeyword();
				this.current = this.current.parent.add(new stylecow.Selector);
				return true;
			}
		},

		'*': function () {
			return this.initSelectorKeyword();
		},

		'.': function () {
			return this.initSelectorKeyword();
		},

		'[': function () {
			return this.initSelectorKeyword();
		},

		'#': function () {
			return this.initSelectorKeyword();
		},

		'+': function () {
			return this.initSelectorOperator();
		},

		'>': function () {
			return this.initSelectorOperator();
		},

		'~': function () {
			return this.initSelectorOperator();
		},

		';': function () {
			if (this.currType === 'value') {
				if (this.buffer) {
					this.current.add(new stylecow.Keyword(this.buffer));
				}
				this.current = this.current.parent.parent;
				this.buffer = '';
				return true;
			}

			if (this.currType === 'declaration') {
				switch (this.current.type) {
					case 'Charset':
					case 'Import':
					case 'Namespace':
						var matches = this.buffer.trim().match(/^(url\()?['"]?([^'"\)]+)/);
						this.current.name = matches[2];
						this.current = this.current.parent;
						this.buffer = '';
						return true;
				}
			}
		},

		'(': function () {
			if (this.currType === 'value' || this.currType === 'selector') {
				this.current = this.current.add(new stylecow.Function(this.buffer)).add(new stylecow.Argument);
				this.buffer = '';
				return true;
			}
		},

		')': function () {
			switch (this.current.type) {
				case 'Argument':
					this.current.add(new stylecow.Keyword(this.buffer));
					this.current = this.current.parent.parent;
					this.buffer = '';
					return true;
			}
		},

		'&': function () {
			if (this.currType === 'rule') {
				this.current = this.current.add(new stylecow.Rule).add(new stylecow.Selector);
				this.current.add(new stylecow.Keyword(this.currChar));
				this.buffer = '';
				return true;
			}
		},

		'/': function () {
			if (this.code[this.pos] === '*') {
				var c = '';

				this.next();

				while (this.next()) {
					c += this.currChar;

					if (this.currChar === '*' && this.code[this.pos] === '/') {
						this.current.add(new stylecow.Comment(c.slice(0, -1)));
						this.next();
						return true;
					}
				}
			}
		},

		initSelectorKeyword: function () {
			if (this.currType === 'selector') {
				if (this.buffer) {
					this.current.add(new stylecow.Keyword(this.buffer));
				}

				this.buffer = '';
			}
			else if (this.currType === 'rule') {
				if (this.buffer) {
					this.current = this.current.add(new stylecow.Rule).add(new stylecow.Selector);
					this.current.add(new stylecow.Keyword(this.buffer));
				}

				this.buffer = '';
			}
		},

		initSelectorOperator: function () {
			if (this.currType === 'selector') {
				this.current.add(new stylecow.Keyword(this.buffer));
				this.current.add(new stylecow.Keyword(this.currChar));
				this.buffer = '';
				return true;
			}

			if (this.currType === 'rule') {
				if (this.buffer) {
					this.current = this.current.add(new stylecow.Rule).add(new stylecow.Selector);
					this.current.add(new stylecow.Keyword(this.buffer));
					this.current.add(new stylecow.Keyword(this.currChar));
					this.buffer = '';
				}
				return true;
			}
		}
	};

	stylecow.parse = function (code, parent) {
		parent = parent || new stylecow.Root();

		var parser = new Parser(code, parent);

		return parser.run();
	};

})(require('./index'));
