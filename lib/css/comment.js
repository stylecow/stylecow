(function (stylecow) {

	stylecow.Comment = function (name) {
		this.class = 'Comment';
		this.type = 'Comment';

		if (name) {
			this.name = name;
		}
	};

	stylecow.Comment.prototype = Object.create(stylecow.Base, {
		name: {
			get: function () {
				return this._name;
			},
			set: function (name) {
				name = name || '';

				this.important = (name.trim()[0] === '!');
				this._name = name;
			}
		},

		toString: {
			value: function () {
				return '/*' + this._name + '*/';
			}
		},

		parse: {
			value: function (reader) {
				reader.seekAndFetch('*');

				var txt = '';

                while (!reader.eot()) {
                    reader.next();
                    txt += reader.currChar;

					if (reader.prevChar === '*' && reader.currChar === '/') {
                        break;
                    }
                }

				this.name = txt.slice(0, -2);
			}
		}
	});
})(require('../index'));
