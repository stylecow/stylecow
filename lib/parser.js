(function (stylecow) {
	var spaces = [' ', '\t', '\n', '\r'];
	var collapsedSelector = spaces.concat(['>', '~', '+', '{']);

	var Parser = function (code, parent) {
		this.code = code;
		this.parent = parent || new stylecow.Root();
	};

	Parser.prototype = {
		keyChars: ['{', '}', ':', ' ', '*', '.', '[', '#', '+', '>', '~', ';', '(', ')', ',', '/'],

		run: function () {
			this.pos = 0;
			this.col = 0;
			this.line = 0;
			this.buffer = '';
			this.current = this.parent;
			this.currChar = '';
			this.length = this.code.length;

			this.init();

			while (this.next()) {
				if (this.skip()) {
					continue;
				}

				if (this.keyChars.indexOf(this.currChar) !== -1) {
					if (!this[this.currChar]()) {
						this.buffer += this.currChar;
					}
				} else {
					if (this.buffer === '') {
						this.init();
					}

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

			//Selector
			if (this.current.type === 'Selector') {
				var c = this.currChar;

				if (collapsedSelector.indexOf(this.currChar) !== -1) {
					var next = this.code[this.pos];

					while (collapsedSelector.indexOf(next) !== -1) {
						c += next || '';
						this.next();
						next = this.code[this.pos];
					}

					this.currChar = c.trim() || ' ';
				}

				return false;
			}

			if (spaces.indexOf(this.currChar) !== -1) {
				return true;
			}
		},

		init: function () {
			switch (this.current.type) {
				case 'Root':
					this.current = this.parent.add(new stylecow.Rule).add(new stylecow.Selector());
					break;
			}
		},

		'{': function () {
			switch (this.current.type) {
				case 'Selector':
					if (this.buffer) {
						this.current.add(new stylecow.Keyword(this.buffer));
					}
					this.current = this.current.parent;
					this.buffer = '';
					return true;
			}
		},

		'}': function () {
			switch (this.current.type) {
				case 'Value':
					this.current.add(new stylecow.Keyword(this.buffer));
					this.current = this.current.parent.parent.parent;
					this.buffer = '';
					return true;

				case 'Declaration':
					this.current = this.current.parent.parent;
					this.buffer = '';
					return true;

				case 'Rule':
					this.current = this.current.parent;
					this.buffer = '';
					return true;
			}
		},

		':': function () {
			switch (this.current.type) {
				case 'Rule':
					this.current = this.current.add(new stylecow.Declaration(this.buffer)).add(new stylecow.Value());
					this.buffer = '';
					return true;

				case 'Selector':
					if (this.buffer && this.buffer.substr(-1) !== ':') {
						this.current.add(new stylecow.Keyword(this.buffer));
						this.buffer = '';
					}
			}
		},

		' ': function () {
			switch (this.current.type) {
				case 'Value':
					this.current = this.current.add(new stylecow.Keyword(this.buffer));
					this.buffer = '';
					return true;

				case 'Selector':
					this.current.add(new stylecow.Keyword(this.buffer));
					this.current.add(new stylecow.Keyword(' '));
					this.buffer = '';
					return true;
			}
		},

		'*': function () {
			if (this.current.type === 'Selector') {
				this.current.add(new stylecow.Keyword(this.buffer));
				this.buffer = '';
			}
		},

		'.': function () {
			if (this.current.type === 'Selector') {
				if (this.buffer) {
					this.current.add(new stylecow.Keyword(this.buffer));
				}
				this.buffer = '';
			}
		},

		'[': function () {
			if (this.current.type === 'Selector') {
				if (this.buffer) {
					this.current.add(new stylecow.Keyword(this.buffer));
				}
				this.buffer = '';
			}
		},

		'#': function () {
			if (this.current.type === 'Selector') {
				if (this.buffer) {
					this.current.add(new stylecow.Keyword(this.buffer));
				}
				this.buffer = '';
			}
		},

		'+': function () {
			if (this.current.type === 'Selector') {
				this.current.add(new stylecow.Keyword(this.buffer));
				this.current.add(new stylecow.Keyword('+'));
				this.buffer = '';
				return true;
			}
		},

		'>': function () {
			if (this.current.type === 'Selector') {
				this.current.add(new stylecow.Keyword(this.buffer));
				this.current.add(new stylecow.Keyword('>'));
				this.buffer = '';
				return true;
			}
		},

		'~': function () {
			if (this.current.type === 'Selector') {
				this.current.add(new stylecow.Keyword(this.buffer));
				this.current.add(new stylecow.Keyword('>'));
				this.buffer = '';
				return true;
			}
		},

		';': function () {
			switch (this.current.type) {
				case 'Value':
					if (this.buffer) {
						this.current.add(new stylecow.Keyword(this.buffer));
					}
					this.current = this.current.parent.parent;
					this.buffer = '';
					return true;
			}
		},

		'(': function () {
			switch (this.current.type) {
				case 'Value':
				case 'Selector':
					this.current = this.current.add(new stylecow.Function(this.buffer));
					this.buffer = '';
					return true;
			}
		},

		')': function () {
			switch (this.current.type) {
				case 'Function':
					this.current.add(new stylecow.Keyword(this.buffer));
					this.current = this.current.parent;
					this.buffer = '';
					return true;
			}
		},

		',': function () {
			switch (this.current.type) {
				case 'Function':
					this.current.add(new stylecow.Keyword(this.buffer));
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
		}
	};

	stylecow.parse = function (code, parent) {
		parent = parent || new stylecow.Root();

		var parser = new Parser(code, parent);

		return parser.run();
	};

})(require('./index'));
