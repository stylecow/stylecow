(function (stylecow) {
    var spaceRegex = /^\s$/;
    var commentRegex = /^\s*\/\*/;
    var nestedRegex = /^[^;}]*\{/;
    var functionRegex = /^\s*[\w:-]+\(/;
    var atRuleRegex = /^\s*@[\w:-]/;
    var stringRegex = /^\s*['"]/;
    var expressionRegex = /^\s*\(/;
    var combinatorRegex = /^\s*[>~\+]/;

    stylecow.Reader = function (code) {
        this.code = code;
        this.col = 1;
        this.line = 1;
        this.buffer = '';
        this.breakChars = [];

        this.currChar = '';
        this.prevChar = '';
        this.nextChar = this.code[0];
    };

    stylecow.Reader.readFile = function (file) {
        var code = require('fs').readFileSync(file, 'utf8');

        return new stylecow.Reader(code);
    };

    stylecow.Reader.prototype = {
        breakOn: function (breakChar) {
            this.breakChars.unshift(breakChar);
        },

        eot: function () {
            return (this.nextChar === undefined);
        },

        next: function () {
            this.prevChar = this.currChar;
            this.currChar = this.nextChar;
            this.code = this.code.substr(1);
            this.nextChar = this.code[0];

            if (this.currChar === '\n') {
                ++this.line;
                this.col = 1;
            } else {
                ++this.col;
            }
        },

        go: function () {
            if (this.eot()) {
                return false;
            }

            var pos = this.breakChars.indexOf(this.nextChar);

            if (pos !== -1) {
                this.breakChars.shift();

                if (pos === 0 && !spaceRegex.test(this.nextChar)) {
                    this.next();
                }

                return false;
            }

            this.next();

            if (spaceRegex.test(this.currChar)) {
                this.trim();
                return this.go();
            }

            this.buffer += this.currChar;

            return true;
        },

        run: function (parent, callback, breakChar) {
            this.breakOn(breakChar);

            while ((callback(parent, this) !== false) && this.go()) {}
        },

        fetch: function () {
            var buffer = this.buffer;
            this.buffer = '';
            return buffer;
        },

        seekAndFetch: function (breakChar) {
            this.breakOn(breakChar);
            while (this.go()) {}
            return this.fetch();
        },

        trim: function () {
            while (spaceRegex.test(this.nextChar) && !this.eot()) {
                this.next();
            }
        },

        isFunction: function () {
            return functionRegex.test(this.buffer + this.code);
        },

        isComment: function () {
            return commentRegex.test(this.buffer + this.code);
        },

        isNested: function () {
            return nestedRegex.test(this.buffer + this.code);
        },

        isCombinator: function () {
            return combinatorRegex.test(this.buffer + this.code);
        },

        isAtRule: function () {
            return atRuleRegex.test(this.buffer + this.code);
        },

        isString: function () {
            return stringRegex.test(this.buffer + this.code);
        },

        isExpression: function () {
            return expressionRegex.test(this.buffer + this.code);
        }
    };
})(require('./index'));
