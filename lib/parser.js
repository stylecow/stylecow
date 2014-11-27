(function (stylecow) {
    var collapsedSpaces = [' ', '\t', '\n', '\r'];
    var collapsedSelector = collapsedSpaces.concat(['>', '~', '+', ',', '{']);
    var collapsedValue = collapsedSpaces.concat([',']);

    var keyChars = ['{', '}', ':', ' ', '*', '.', '[', '#', '+', '>', '~', ';', '(', ')', ',', '/', '&', '@'];

    var COMMENT         = 1;
    var FUNCTION        = 2;
    var KEYWORD         = 4;
    var DECLARATION     = 8;
    var RULE            = 16;
    var SELECTOR        = 32;
    var VALUE           = 64;
    var CONDITION       = 128;

    var HAS_SELECTOR    = 256;
    var HAS_URL         = 512;
    var HAS_VALUE       = 1024;
    var HAS_CONDITION   = 2048;

    var IS_OPENED       = 4096;
    
    var COLLAPSE_SELEC  = 8192;
    var COLLAPSE_VALUE  = 16384;

    var types = {
        AtRule:         DECLARATION,
        Argument:       VALUE | COLLAPSE_VALUE,
        Comment:        COMMENT,
        Condition:      CONDITION,
        Declaration:    DECLARATION,
        Function:       FUNCTION | COLLAPSE_VALUE,
        Keyword:        KEYWORD,
        NestedAtRule:   RULE | HAS_SELECTOR | COLLAPSE_SELEC,
        Selector:       SELECTOR | COLLAPSE_SELEC,
        Root:           RULE | COLLAPSE_SELEC | IS_OPENED,
        Rule:           RULE | HAS_SELECTOR | COLLAPSE_SELEC,
        Value:          VALUE | COLLAPSE_VALUE
    };

    var atRulesTypes = {
        '@media':       RULE | HAS_CONDITION | COLLAPSE_SELEC,
        '@keyframes':   RULE | HAS_VALUE | COLLAPSE_SELEC,
        '@font-face':   RULE | COLLAPSE_SELEC,
        '@supports':    RULE | HAS_CONDITION | COLLAPSE_SELEC,
        '@document':    RULE | HAS_SELECTOR | COLLAPSE_SELEC,
        '@import':      DECLARATION | HAS_URL | HAS_CONDITION,
        '@charset':     DECLARATION | HAS_VALUE,
        '@namespace':   DECLARATION | HAS_VALUE | HAS_URL,
    };

    var uniqueArgumentFunctions = ['url', 'src'];

    var Parser = function (code, parent) {
        this.code = code;
        this.parent = parent;
    };

    Parser.prototype = {
        add: function (item) {
            item._data = {
                sourceColumn: this.col,
                sourceLine: this.line
            };

            this.current.push(item);

            return item;
        },

        down: function (item) {
            this.current = this.add(item);
            this.treeTypes.push(this.currType);

            if ((this.current.type === 'AtRule' || this.current.type === 'NestedAtRule') && atRulesTypes['@' + this.current.name]) {
                this.currType = atRulesTypes['@' + this.current.name];
            } else {
                this.currType = types[item.type];
            }

            return this;
        },

        up: function () {
            if (!this.current._parent) {
                switch (this.current.type) {
                    case 'Value':
                        this.current._parent = new stylecow.Declaration;
                        break;

                    case 'Argument':
                        this.current._parent = new stylecow.Function;
                        break;

                    case 'Function':
                    case 'Keyword':
                        this.current._parent = new stylecow.Value;
                        break;

                    case 'Condition':
                    case 'Selector':
                        this.current._parent = new stylecow.Rule;
                        break;

                    default:
                        this.current._parent = new stylecow.Root;
                        break;
                }

                this.treeTypes.unshift(types[this.current._parent.type]);
                this.current._parent.push(this.current);
            }

            this.current = this.current._parent;
            this.currType = this.treeTypes.pop();

            return this;
        },

        run: function () {
            this.pos = 0;
            this.col = 1;
            this.line = 1;
            this.buffer = '';
            this.currChar = '';
            this.length = this.code.length;

            this.treeTypes = [];
            this.currType = types[this.parent.type];
            this.current = this.parent;

            if (this.currType & RULE) {
                this.currType = this.currType | IS_OPENED;
            }

            while (this.next()) {
                if (this.seek()) {
                    continue;
                }

                if (keyChars.indexOf(this.currChar) !== -1) {
                    if (!this[this.currChar]()) {
                        this.buffer += this.currChar;
                    } else {
                        this.buffer = '';
                    }
                } else {
                    this.buffer += this.currChar;
                }
            }

            if (this.buffer) {
                this.end();
            }

            return this.parent;
        },

        next: function () {
            this.currChar = this.code[this.pos];
            ++this.pos;

            if (this.pos > this.length) {
                return false;
            }

            if (this.currChar === '\n') {
                ++this.line;
                this.col = 1;
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

        end: function () {
            if (this.currType & VALUE || this.currType & SELECTOR) {
                this.add(new stylecow.Keyword(this.buffer));
            }

            else if (this.currType & FUNCTION) {
                this.add(new stylecow.Argument).add(new stylecow.Keyword(this.buffer));
            }

            else if (this.currType & DECLARATION) {
                this.add(new stylecow.Value).add(new stylecow.Keyword(this.buffer));
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
                if (!this.buffer) {
                    this.currType = this.currType | IS_OPENED;
                    return true;
                }

                if (this.currType & IS_OPENED) {
                    this.down(new stylecow.Rule).notOpenedRuleOrDeclaration();

                    if (this.currType & SELECTOR) {
                        this.up();
                    }
                    
                    this.currType = this.currType | IS_OPENED;

                    return true;
                }

                this.notOpenedRuleOrDeclaration();

                if (this.currType & SELECTOR) {
                    this.up();
                }

                this.currType = this.currType | IS_OPENED;
                return true;
            }

            if (this.currType & SELECTOR) {
                this.selector();
                this.up();
                this.currType = this.currType | IS_OPENED;
                return true;
            }
        },

        '}': function () {
            if (this.currType & RULE) {
                this.up();
                return true;
            }

            else if (this.currType & DECLARATION) {
                this.up().up();
                return true;
            }

            else if (this.currType & VALUE) {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }
                this.up().up().up();
                return true;
            }
        },

        ':': function () {
            if (this.currType & RULE) {
                if (this.currType & IS_OPENED) {
                    if (this.isNested()) {
                        return this.down(new stylecow.Rule).notOpenedRuleOrDeclaration();
                    }

                    this.down(new stylecow.Declaration(this.buffer)).down(new stylecow.Value);
                    return true;
                }
            }

            else if (this.buffer && this.buffer.substr(-1) !== ':') {
                return this.selector();
            }
        },

        ' ': function () {
            if (this.currType & VALUE) {
                this.add(new stylecow.Keyword(this.buffer));
                return true;
            }

            else if (this.currType & RULE) {
                if (this.currType & IS_OPENED) {
                    return this.down(new stylecow.Rule).notOpenedRuleOrDeclaration(true);
                } else {
                    return this.notOpenedRuleOrDeclaration(true);
                }
            }

            else if (this.currType & DECLARATION) {
                return this.notOpenedRuleOrDeclaration(true);
            }
        },

        ',': function () {
            if (this.currType & FUNCTION) {
                if (this.buffer) {
                    this.add(new stylecow.Argument).add(new stylecow.Keyword(this.buffer));
                }

                this.down(new stylecow.Argument);

                return true;
            }

            if (this.currType & DECLARATION) {
                if (this.buffer) {
                    this.add(new stylecow.Value).add(new stylecow.Keyword(this.buffer));
                }

                this.down(new stylecow.Value);
                return true;
            }

            if (this.currType & VALUE) {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }

                var child = new stylecow[this.current.type];
                this.up().down(child);
                return true;
            }

            if (this.currType & RULE) {
                if (this.currType & IS_OPENED) {
                    this.down(new stylecow.Rule);
                }

                return this.notOpenedRuleOrDeclaration();
            }

            if (this.currType & SELECTOR) {
                this.selector();
                this.up().down(new stylecow.Selector);
                return true;
            }
        },

        '*': function () {
            return this.selectorOrRule();
        },

        '.': function () {
            return this.selectorOrRule();
        },

        '[': function () {
            return this.selectorOrRule();
        },

        '#': function () {
            return this.selectorOrRule();
        },

        '+': function () {
            return this.selectorOrRule(true);
        },

        '>': function () {
            return this.selectorOrRule(true);
        },

        '~': function () {
            return this.selectorOrRule(true);
        },

        ';': function () {
            if (this.currType & VALUE) {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }
                this.up().up();
                return true;
            }

            else if (this.currType & DECLARATION) {
                if (this.buffer) {
                    this.notOpenedRuleOrDeclaration();
                }
                this.up();
                return true;
            }
        },

        '(': function () {
            if (this.buffer) {
                if (this.currType & VALUE || this.currType & SELECTOR || this.currType & HAS_URL) {
                    this.down(new stylecow.Function(this.buffer));

                    if (uniqueArgumentFunctions.indexOf(this.buffer) !== -1) {
                        this.buffer = '';

                        while (this.next()) {
                            if (this.currChar === ')') {
                                return this[')']();
                            }

                            this.buffer += this.currChar;
                        }
                    }

                    this.down(new stylecow.Argument);
                    return true;
                }
            } else {
                if (this.currType & DECLARATION || (this.currType & RULE && !(this.currType & IS_OPENED))) {
                    return this.notOpenedRuleOrDeclaration();
                }
            }
        },

        ')': function () {
            if (this.current.type === 'Argument') {
                if (this.buffer) {
                    this.add(new stylecow.Keyword(this.buffer));
                }

                this.up().up();
                return true;
            }

            if (this.currType & FUNCTION) {
                if (this.buffer) {
                    this.add(new stylecow.Argument).add(new stylecow.Keyword(this.buffer));
                }

                this.up();
                return true;
            }
        },

        '&': function () {
            if (this.currType & RULE) {
                this.down(new stylecow.Rule);

                return this.notOpenedRuleOrDeclaration(true);
            }
        },

        '@': function () {
            if (this.currType & RULE) {
                this.buffer += this.currChar;

                while (this.next() && collapsedSpaces.indexOf(this.currChar) === -1) {
                    this.buffer += this.currChar;
                }

                var nested;

                if (atRulesTypes[this.buffer]) {
                    nested = atRulesTypes[this.buffer] & RULE;
                } else {
                    nested = this.isNested();
                }

                if (nested) {
                    this.down(new stylecow.NestedAtRule(this.buffer));
                } else {
                    this.down(new stylecow.AtRule(this.buffer));
                }

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

        selectorOrRule: function (operator) {
            if (this.currType & SELECTOR) {
                return this.selector(operator);
            }

            if (this.currType & RULE) {
                if (this.currType & IS_OPENED) {
                    this.down(new stylecow.Rule);
                }
                
                return this.notOpenedRuleOrDeclaration(operator);
            }
        },

        selector: function (operator) {
            if (this.buffer) {
                this.add(new stylecow.Keyword(this.buffer));
                this.buffer = '';
            }

            if (operator) {
                this.add(new stylecow.Keyword(this.currChar));
                return true;
            }
        },

        isNested: function () {
            var isNested = this.code.indexOf('{', this.pos);

            return (isNested !== -1 && isNested < this.code.indexOf(';', this.pos) && isNested < this.code.indexOf('}', this.pos));
        },

        notOpenedRuleOrDeclaration: function (operator) {
            if (this.currType & HAS_VALUE) {
                if ((this.buffer[0] !== '"' && this.buffer[0] !== "'") || !(this.currType & HAS_URL)) {
                    this.add(new stylecow.Value).add(new stylecow.Keyword(this.buffer));
                    this.currType = this.currType ^ HAS_VALUE;
                    return true;
                }
            }

            if (this.currType & HAS_URL) {
                var matches = this.buffer.trim().match(/^(url\(|'|")['"]?([^'"\)]+)/);

                if (matches) {
                    this.add(new stylecow.Function('url')).add(new stylecow.Argument).add(new stylecow.Keyword(matches[2]));
                    this.currType = this.currType ^ HAS_URL;
                    return true;
                }
            }

            if (this.currType & HAS_SELECTOR) {
                this.down(new stylecow.Selector);
                return this.selector(operator);
            }

            if (this.currType & HAS_CONDITION) {
                if (this.currChar === '{') {
                    this.current.add(new stylecow.Condition(this.buffer.trim()));
                    this.currType = this.currType ^ HAS_CONDITION;
                    this.currType = this.currType | IS_OPENED;
                    return true;
                }

                this.buffer += this.currChar;
                var deep = (this.currChar === '(') ? 1 : 0;

                while (this.next()) {
                    if (this.currChar === '(') {
                        ++deep;
                    }

                    else if (this.currChar === ')') {
                        --deep;
                    }

                    else if (!deep) {
                        if (this.currChar === '{') {
                            this.current.add(new stylecow.Condition(this.buffer.trim()));
                            this.currType = this.currType ^ HAS_CONDITION;
                            this.currType = this.currType | IS_OPENED;
                            return true;
                        }

                        else if (this.currChar === ';') {
                            this.current.add(new stylecow.Condition(this.buffer.trim()));
                            this.currType = this.currType ^ HAS_CONDITION;
                            this.up();
                            return true;
                        }
                    }

                    this.buffer += this.currChar;
                }
            }
        }
    };

    stylecow.parse = function (code, parent) {
        if (typeof parent === 'string') {
            parent = new stylecow[parent];
        } else {
            parent = parent || new stylecow.Root();
        }

        var parser = new Parser('' + code, parent);

        try {
            return parser.run();
        } catch (error) {
            throw new stylecow.Error('Error parsing the css code', {
                line: parser.line,
                column: parser.col,
                buffer: parser.buffer,
                error: error
            });
        }
    };

})(require('./index'));
