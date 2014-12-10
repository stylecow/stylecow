(function (stylecow) {

	stylecow.String = function (name) {
		this.class = 'String';
		this.type = 'String';
		
		if (name) {
			this.name = name;
		}
	};

	stylecow.String.prototype = Object.create(stylecow.Base, {

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
