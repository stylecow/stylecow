(function (stylecow) {

	stylecow.Comment = function (name) {
		this.type = 'Comment';
		this.name = name;
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
				return '/* ' + this._name + ' */';
			}
		},

		toCode: {
			value: function (code) {
				if (!this._name || code.style.comments === 'none' || (code.style.comments === 'important' && !this.important)) {
					return false;
				}

				code.append(code.style.commentStart + this._name + code.style.commentEnd, this);
			}
		}
	});
})(require('../index'));
