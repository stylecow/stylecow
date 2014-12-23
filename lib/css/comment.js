(function (stylecow) {

	stylecow.Comment = function () {};

	stylecow.Comment.createFromString = function (string) {
		return stylecow.Comment.create(new stylecow.Reader(string));
	};

	stylecow.Comment.create = function (reader) {
		var element = reader.setData(new stylecow.Comment());
		var buffer = '';

        while (reader.next(true)) {
			if (reader.currChar === '*' && reader.nextChar === '/') {
                break;
            }

            buffer += reader.currChar;
        }

        reader.next();
        reader.next();

		element.name = buffer.substr(1);

		return element;
	};

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

		toCode: {
			value: function (code) {
				if (!this.name || code.style.comments === 'none' || (code.style.comments === 'important' && !this.important)) {
					return false;
				}

				code.append(code.style.commentStart + this.name + code.style.commentEnd, this);
			}
		}
	});
})(require('../index'));
