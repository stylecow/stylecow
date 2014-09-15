(function (css) {

	css.Import = function (url) {
		this.type = 'Import';
		this.url = url;
	};

	css.Import.create = function (string) {
		var matches = string.trim().match(/^\@import (url\()?['"]?([^'"\)]+)/);

		return new css.Import(matches[2]);
	};

	css.Import.prototype = Object.create(css.Base, {

		toString: {
			value: function () {
				return '@import "' + this.url + '"';
			}
		},

		toCode: {
			value: function (style) {
				return this.toString() + style.ruleEnd;
			}
		}
	});
})(require('../css'));
