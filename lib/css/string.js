(function (stylecow) {

	stylecow.String = function () {};

	stylecow.String.createFromString = function (string) {
		return stylecow.String.create(new stylecow.Reader(string));
	};

	stylecow.String.create = function (reader) {
		var element = reader.setData(new stylecow.String());
        var quote = reader.currChar;
		var buffer = '';

        while (reader.next()) {
            buffer += reader.currChar;

            if (reader.currChar === quote) {
            	reader.next();
                break;
            }
        }

		element.name = buffer.slice(0, -1);

		return element;
	};

	stylecow.String.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'String'
		},

		toString: {
			value: function () {
				return '"' + this.name.replace(/"/g, '\\"') + '"';
			}
		},

		toCode: {
			value: function (code) {
				code.append(this.toString(), this);
			}
		}
	});
})(require('../index'));
