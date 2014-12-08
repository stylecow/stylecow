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
				while (reader.currChar !== '"' && reader.currChar !== "'" && !reader.eot()) {
					reader.next();
				}

				var c = reader.currChar;
				var txt = '';

                while (!reader.eot()) {
                    reader.next();
                    txt += reader.currChar;

                    if (reader.currChar === c) {
                        break;
                    }
                }

				this.name = txt.slice(0, -1);
			}
		}
	});
})(require('../index'));
