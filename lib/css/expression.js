(function (stylecow) {

	stylecow.Expression = function () {};

	stylecow.Expression.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Expression'
		},

		toString: {
			value: function () {
				return '(' + this.name + ')';
			}
		},

		parse: {
			value: function (reader) {
				var buffer = '';
				var deep = 1;

                while (reader.next(true)) {
                	if (reader.currChar === '(') {
                		++deep;
                	} else if (reader.currChar === ')') {
                		--deep;

                		if (deep === 0) {
                			break;
                		}
                	}

                	buffer += reader.currChar;
                }

                reader.next();
                this.name = buffer;
			}
		}
	});
})(require('../index'));
