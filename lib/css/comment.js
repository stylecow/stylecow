(function (stylecow) {

	stylecow.Comment = function (text) {
		this.type = 'Comment';
		this.text = text;
	};

	stylecow.Comment.prototype = Object.create(stylecow.Base, {

		text: {
			get: function () {
				return this._text;
			},
			set: function (value) {
				value = value || '';

				if (value.trim()[0] === '!') {
					this.important = true;
					value = value.substr(1).trim();
				} else {
					this.important = false;
				}

				this._text = value;
			}
		},

		toString: {
			value: function () {
				return '/* ' + (this.important ? '! ' : '') + this._text + ' */';
			}
		},

		toCode: {
			value: function () {
				if (!this._text || stylecow.codeStyle.comments === 'none' || (stylecow.codeStyle.comments === 'important' && !this.important)) {
					return '';
				}

				return stylecow.codeStyle.commentStart + (this.important ? '! ' : '') + this._text + stylecow.codeStyle.commentEnd;
			}
		}
	});
})(require('../index'));
