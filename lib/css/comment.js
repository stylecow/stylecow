(function (css) {

	css.Comment = function (text) {
		this.type = 'Comment';
		this.text = text;
	};

	css.Comment.create = function (string) {
		var matches = string.match(/^\s*\/\*((.|\s)+)\*\/\s*$/m);

		return new css.Comment(matches[1]);
	};

	css.Comment.prototype = Object.create(css.Base, {

		text: {
			get: function () {
				return this._text;
			},
			set: function (value) {
				value = value.trim();

				if (value[0] === '!') {
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
			value: function (style) {
				if (!this._text || style.comments === 'none' || (style.comments === 'important' && !this.important)) {
					return '';
				}

				return style.commentStart + (this.important ? '! ' : '') + this._text + style.commentEnd;
			}
		}
	});
})(require('../css'));
