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
			value: function () {
				if (!this._name || stylecow.codeStyle.comments === 'none' || (stylecow.codeStyle.comments === 'important' && !this.important)) {
					return '';
				}

				return stylecow.codeStyle.commentStart + this._name + stylecow.codeStyle.commentEnd;
			}
		}
	});
})(require('../index'));
