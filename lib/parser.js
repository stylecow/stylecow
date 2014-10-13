(function (stylecow) {
    var collapsedSpaces = [' ', '\t', '\n', '\r'];
    var collapsedSelector = collapsedSpaces.concat(['>', '~', '+', ',', '{']);
    var collapsedValue = collapsedSpaces.concat([',']);

    var keyChars = ['{', '}', ':', ' ', '*', '.', '[', '#', '+', '>', '~', ';', '(', ')', ',', '/', '&'];

    var COMMENT         = 1;
    var FUNCTION        = 2;
    var KEYWORD         = 4;
    var DECLARATION     = 8;
    var RULE            = 16;
    var SELECTOR        = 32;
    var VALUE           = 64;

    var HAS_SELECTOR    = 128;
    var HAS_NAME        = 256;
    var HAS_URL         = 512;
    var HAS_VALUE       = 1024;
    
    var COLLAPSE_SELEC  = 2048;
    var COLLAPSE_VALUE  = 4096;

    var types = {
        Comment:        COMMENT,
        Function:       FUNCTION | COLLAPSE_VALUE,
        Keyword:        KEYWORD,
        Expression:     KEYWORD,
        Charset:        DECLARATION | HAS_NAME,
        Declaration:    DECLARATION | HAS_VALUE,
        Import:         DECLARATION | HAS_URL,
        Namespace:      DECLARATION | HAS_NAME | HAS_URL,
        Keyframes:      RULE | HAS_NAME | COLLAPSE_SELEC,
        Supports:       RULE | HAS_NAME | COLLAPSE_SELEC,
        Media:          RULE | HAS_NAME | COLLAPSE_SELEC,
        Fontface:       RULE | COLLAPSE_SELEC,
        Root:           RULE | COLLAPSE_SELEC,
        Page:           RULE | HAS_SELECTOR | COLLAPSE_SELEC,
        Document:       RULE | HAS_SELECTOR | COLLAPSE_SELEC,
        Rule:           RULE | HAS_SELECTOR | COLLAPSE_SELEC,
        Selector:       SELECTOR | COLLAPSE_SELEC,
        Argument:       VALUE | COLLAPSE_VALUE,
        Value:          VALUE | COLLAPSE_VALUE
    };

    var atRules = {
        '@charset': 'Charset',
        '@import': 'Import',
        '@namespace': 'Namespace',
        '@media': 'Media',
        '@page': 'Page',
        '@font-face': 'Fontface',
        '@keyframes': 'Keyframes',
        '@supports': 'Supports',
        '@document': 'Document',
        '@supports': 'Supports'
    };

    var Parser = function (code, parent) {
        this.code = code;
        this.parent = parent || new stylecow.Root();
    };

    Parser.prototype = {
        add: function (item) {
            return this.current.add(item);
        },

        down: function (item) {
            this.current = this.current.add(item);
            this.treeTypes.push(this.currType);
            this.currType = types[item.type];

            return this;
        },

        up: function () {
            this.current = this.current.parent;
            this.currType = this.treeTypes.pop();

            return this;
        },

        run: function () {
            this.pos = 0;
            this.col = 0;
            this.line = 0;
            this.buffer = '';
            this.currChar = '';
            this.length = this.code.length;

            this.current = this.parent;
            this.treeTypes = [];
            this.currType = types[this.current.type];

            while (this.next()) {
                if (this.seek()) {
                    continue;
                }

                if (keyChars.indexOf(this.currChar) !== -1) {
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

        seek: function () {
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

            if (this.currType & COLLAPSE_SELEC) {
                if (this.buffer.trim()) {
                    this.collapse(collapsedSelector);
                    return false;
                }
            }

            else if (this.currType & COLLAPSE_VALUE) {
                if (this.buffer.trim()) {
                    this.collapse(collapsedValue);
                    return false;
                }
            }

            if (!this.buffer && collapsedSpaces.indexOf(this.currChar) !== -1) {
                return true;
            }
        },

        collapse: function (validChars) {
            if (validChars.indexOf(this.currChar) !== -1) {
                var c = this.currChar.trim();
                var next = this.code[this.pos];

                while (validChars.indexOf(next) !== -1) {
                    if (collapsedSpaces.indexOf(next) === -1) {
                        if (c) {
                            break;
                        }

                        c = next;
                    }
                    this.next();
                    next = this.code[this.pos];
                }

                this.currChar = c || ' ';
            }
        },

        '{': function () {
            if (this.currType & RULE) {
                if (this.buffer) {
                    if (this.currType & HAS_NAME) {
                        this.current.name = this.buffer;
                        this.currType = this.currType ^ HAS_NAME;
                        this.buffer = '';
                        return true;
                    }

                    var atRule = atRules[this.buffer];
                    
                    if (atRule) {
                        this.down(new stylecow[atRule]);

                        if (this.currType & HAS_SELECTOR) {
                            this.down(new stylecow.Selector);
                        }
                    } else {
                        this.down(new stylecow.Rule);
                        this.add(new stylecow.Selector).add(new stylecow.Keyword(this.buffer));
                    }
                }

                this.buffer = '';
                return true;
            }

            if (this.currType & SELECTOR) {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }
                this.up();
                this.buffer = '';
                return true;
            }
        },

        '}': function () {
            if (this.currType & RULE) {
                this.up();
                this.buffer = '';
                return true;
            }

            if (this.currType & DECLARATION) {
                this.up().up();
                this.buffer = '';
                return true;
            }

            if (this.currType & VALUE) {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }
                this.up().up().up();
                this.buffer = '';
                return true;
            }
        },

        ':': function () {
            if (this.currType & RULE) {
                var isNested = this.code.indexOf('{', this.pos);

                //Nested rule
                if (isNested !== -1 && isNested < this.code.indexOf(';', this.pos) && isNested < this.code.indexOf('}', this.pos)) {
                    this.down(new stylecow.Rule).down(new stylecow.Selector);

                    return this[':']();
                }

                this.down(new stylecow.Declaration(this.buffer)).down(new stylecow.Value);
                this.buffer = '';
                return true;
            }

            if (this.buffer && this.buffer.substr(-1) !== ':') {
                return this.initSelectorKeyword();
            }
        },

        ' ': function () {
            if (this.currType & VALUE) {
                this.add(new stylecow.Keyword(this.buffer));
                this.buffer = '';
                return true;
            }

            if (this.currType & RULE || this.currType & DECLARATION) {
                if (this.currType & HAS_NAME) {
                    this.current.name = this.buffer;
                    this.currType = this.currType ^ HAS_NAME;
                    this.buffer = '';
                    return true;
                }
            }

            if (this.currType & RULE) {
                var atRule = atRules[this.buffer];
                
                if (atRule) {
                    this.down(new stylecow[atRule]);

                    if (this.currType & HAS_SELECTOR) {
                        this.down(new stylecow.Selector);
                    }

                    this.buffer = '';
                    return true;
                }

                return this.initSelectorOperator();
            }
        },

        ',': function () {
            if (this.currType & VALUE) {
                this.add(new stylecow.Keyword(this.buffer));
                var child = new stylecow[this.current.type];
                this.up().down(child);
                this.buffer = '';
                return true;
            }

            if (this.currType & RULE || this.currType & SELECTOR) {
                this.initSelectorKeyword();
                this.up().down(new stylecow.Selector);
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
            if (this.currType & VALUE) {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }
                this.up().up();
                this.buffer = '';
                return true;
            }

            if (this.currType & DECLARATION) {
                if (this.currType & HAS_URL) {
                    var matches = this.buffer.trim().match(/^(url\()?['"]?([^'"\)]+)/);
                    this.current.url = matches[2];
                    this.up();
                    this.buffer = '';
                    return true;
                }

                if (this.currType & HAS_NAME) {
                    var matches = this.buffer.trim().match(/^['"]?([^'"]+)$/);
                    this.current.name = matches[2];
                    this.up();
                    this.buffer = '';
                    return true;
                }
            }
        },

        '(': function () {
            if (this.buffer) {
                if (this.currType & VALUE || this.currType & SELECTOR) {
                    this.down(new stylecow.Function(this.buffer)).down(new stylecow.Argument);
                    this.buffer = '';
                    return true;
                }
            } else {
                var c = '';
                var deep = 1;

                while (this.next()) {
                    if (this.currChar === '(') {
                        ++deep;
                    }

                    else if (this.currChar === ')') {
                        --deep;

                        if (deep === 0) {
                            if (this.currType & RULE && this.currType & HAS_NAME) {
                                this.current.name = '(' + c + ')';
                                this.currType = this.currType ^ HAS_NAME;
                            } else {
                                this.down(new stylecow.Expression(c));
                            }

                            return true;
                        }
                    }

                    c += this.currChar;
                }

                this.buffer = '';
                return true;
            }
        },

        ')': function () {
            switch (this.current.type) {
                case 'Argument':
                    if (this.buffer) {
                        this.add(new stylecow.Keyword(this.buffer));
                    }
                    this.up().up();
                    this.buffer = '';
                    return true;
            }
        },

        '&': function () {
            if (this.currType & RULE) {
                this.down(new stylecow.Rule).down(new stylecow.Selector);
                this.add(new stylecow.Keyword(this.currChar));
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
                        this.add(new stylecow.Comment(c.slice(0, -1)));
                        this.next();
                        return true;
                    }
                }
            }
        },

        initSelectorKeyword: function () {
            if (this.currType & SELECTOR) {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }

                this.buffer = '';
            }
            else if (this.currType & RULE) {
                if (this.buffer) {
                    this.down(new stylecow.Rule).down(new stylecow.Selector);
                    this.add(new stylecow.Keyword(this.buffer));
                }

                this.buffer = '';
            }
        },

        initSelectorOperator: function () {
            if (this.currType & SELECTOR) {
                this.add(new stylecow.Keyword(this.buffer));
                this.add(new stylecow.Keyword(this.currChar));
                this.buffer = '';
                return true;
            }

            if (this.currType & RULE) {
                this.down(new stylecow.Rule).down(new stylecow.Selector);
                
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }
                
                this.add(new stylecow.Keyword(this.currChar));
                this.buffer = '';
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
