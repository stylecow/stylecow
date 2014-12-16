(function (stylecow) {

	stylecow.Expression = function () {};

	stylecow.Expression.createFromString = function (string) {
		return stylecow.Expression.create(new stylecow.Reader(string));
	};

	stylecow.Expression.create = function (reader) {
		var element = reader.setData(new stylecow.Expression());
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
        element.name = buffer;

		return element;
	};

	stylecow.Expression.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Expression'
		},

		toString: {
			value: function () {
				return '(' + this.name + ')';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
