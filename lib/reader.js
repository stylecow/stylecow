(function (stylecow) {
    var spaceRegex = /^\s$/;
    var functionRegex = /^[\w:-]+\(/;
    var combinators = ['>', '~', '+'];

    stylecow.Reader = function (code, file) {
        this.file = file || '';
        this.code = code;
        this.pos = 0;
        this.col = 1;
        this.line = 1;
        this.buffer = '';
        this.breakChars = [[]];

        this.nextLine = false;
        this.currChar = '';
        this.prevChar = '';
        this.nextChar = this.code[this.pos];

        this.next();
    };

    stylecow.Reader.readFile = function (file) {
        var path = require('path');
        var fs = require('fs');
        var fullfile = path.resolve(stylecow.cwd(), file);

        if (!fs.existsSync(fullfile)) {
            throw new stylecow.Error('Input file `' + fullfile + '` not found');
        }

        return new stylecow.Reader(fs.readFileSync(fullfile, 'utf8'), file);
    };

    stylecow.Reader.prototype = {
        setData: function (child) {
            child._data = {
                sourceColumn: this.col,
                sourceLine: this.line,
                sourceFile: this.file
            };

            return child;
        },

        addBreakChar: function (breakChar, newGroup) {
            if (newGroup || this.breakChars[0] === undefined) {
                this.breakChars.unshift([]);
            }

            this.breakChars[0].unshift(breakChar);
        },

        next: function (raw) {
            this.prevChar = this.currChar;
            this.currChar = this.nextChar;
            this.nextChar = this.code[++this.pos];

            if (this.nextChar === undefined) {
                return false;
            }

            if (this.nextLine === true) {
                ++this.line;
                this.col = 1;
                this.nextLine = false;
            } else {
                ++this.col;
            }

            if (this.nextChar === '\n') {
                this.nextLine = true;

                if (raw === undefined) {
                    this.nextChar = ' ';
                }
            } else if (raw === undefined && this.nextChar === '\t') {
                this.nextChar = ' ';
            }

            return true;
        },

        checkBreak: function () {
            if (this.nextChar === undefined) {
                return true;
            }

            var pos = this.breakChars[0].indexOf(this.currChar);

            if (this.currChar === ' ' && pos === -1) {
                do {
                    this.next();
                } while (this.currChar === ' ');

                return this.checkBreak();
            }

            if (pos !== -1) {
                this.breakChars[0].shift();

                if ((this.breakChars[0].length === 0) && this.breakChars[1]) {
                    this.breakChars.shift();
                }

                if (pos === 0 && this.currChar !== ' ') {
                    this.next();
                }

                return true;
            }

            return false;
        },

        execute: function (callback, thisArg) {
            while (!this.checkBreak() && (callback.call(thisArg, this) !== false)) {}
        },

        seek: function (breakChar) {
            this.addBreakChar(breakChar);

            var buffer = '';

            while (!this.checkBreak()) {
                buffer += this.currChar;
                this.next();
            }

            return buffer;
        },

        isFunction: function () {
            return functionRegex.test(this.currChar + this.code.slice(this.pos));
        },

        isComment: function () {
            return (this.currChar === '/' && this.nextChar === '*');
        },

        isNested: function () {
            var isNested = this.code.indexOf('{', this.pos);

            return (isNested !== -1 && isNested < this.code.indexOf(';', this.pos) && isNested < this.code.indexOf('}', this.pos));
        },

        isCombinator: function () {
            return combinators.indexOf(this.currChar) !== -1;
        },

        isAtRule: function () {
            return this.currChar === '@';
        },

        isString: function () {
            return this.currChar === '"' || this.currChar === "'";
        },

        isExpression: function () {
            return this.currChar === '(';
        }
    };
})(require('./index'));
