(function (stylecow) {
    var spaceRegex = /^\s$/;
    var nestedRegex = /^[^;}]*\{/;
    var functionRegex = /^[\w:-]+\(/;
    var combinators = ['>', '~', '+'];
    var spaces = [' ', '\n', '\t', '\r'];

    stylecow.Reader = function (code) {
        this.code = code;
        this.col = 1;
        this.line = 1;
        this.buffer = '';
        this.breakChars = [];

        this.nextLine = false;
        this.currChar = '';
        this.prevChar = '';
        this.nextChar = this.code[0];

        this.next();
    };

    stylecow.Reader.readFile = function (file) {
        var code = require('fs').readFileSync(file, 'utf8');

        return new stylecow.Reader(code);
    };

    stylecow.Reader.prototype = {
        breakOn: function (breakChar) {
            this.breakChars.unshift(breakChar);
        },

        next: function (raw) {
            this.prevChar = this.currChar;
            this.currChar = this.nextChar;
            this.code = this.code.substr(1);
            this.nextChar = this.code[0];

            if (this.nextChar === undefined) {
                return false;
            }

            if (this.nextLine) {
                ++this.line;
                this.col = 1;
                this.nextLine = false;
            } else {
                ++this.col;
            }

            if (spaceRegex.test(this.nextChar)) {
                if (this.nextChar === '\n') {
                    this.nextLine = true;
                }

                if (!raw) {
                    this.nextChar = ' ';
                }
            }

            return true;
        },

        checkBreak: function () {
            if (this.nextChar === undefined) {
                return true;
            }

            var pos = this.breakChars.indexOf(this.currChar);

            if (this.currChar === ' ' && pos === -1) {
                do {
                    this.next();
                } while (this.currChar === ' ');

                return this.checkBreak();
            }

            if (pos !== -1) {
                this.breakChars.shift();

                if (pos === 0 && this.currChar !== ' ') {
                    this.next();
                }

                return true;
            }

            return false;
        },

        executeUntil: function (breakChar, callback, thisArg) {
            this.breakOn(breakChar);

            while (!this.checkBreak() && (callback.call(thisArg, this) !== false)) {}
        },

        seek: function (breakChar) {
            this.breakOn(breakChar);

            var buffer = '';

            while (!this.checkBreak()) {
                buffer += this.currChar;
                this.next();
            }

            return buffer;
        },

        isFunction: function () {
            return functionRegex.test(this.currChar + this.code);
        },

        isComment: function () {
            return (this.currChar === '/' && this.nextChar === '*');
        },

        isNested: function () {
            return nestedRegex.test(this.currChar + this.code);
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
