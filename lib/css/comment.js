(function (stylecow) {

	stylecow.Comment = function () {};

	stylecow.Comment.prototype = Object.create(stylecow.Base, {
		type: {
			value: 'Comment'
		},

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
				reader.seek('/');

				var buffer = '';

                while (reader.next(true)) {

					if (reader.currChar === '*' && reader.nextChar === '/') {
                        break;
                    } else {
                    	buffer += reader.currChar;
                    }
                }

                reader.next();
                reader.next();

				this.name = buffer;
			}
		}
	});
})(require('../index'));
