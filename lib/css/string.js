(function (stylecow) {

	stylecow.String = function () {};

	stylecow.String.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'String'
		},

		toString: {
			value: function () {
				return '"' + this.name + '"';
			}
		},

		parse: {
			value: function (reader) {
				var quote = reader.currChar;
				var buffer = '';

                while (reader.next()) {
                    buffer += reader.currChar;

                    if (reader.currChar === quote) {
                    	reader.next();
                        break;
                    }
                }

				this.name = buffer.slice(0, -1);
			}
		}
	});
})(require('../index'));
