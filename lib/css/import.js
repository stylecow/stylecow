(function (stylecow) {

	stylecow.Import = function (url) {
		this.type = 'Import';
		this.url = url;
	};

	stylecow.Import.create = function (string) {
		var matches = string.trim().match(/^\@import (url\()?['"]?([^'"\)]+)/);

		return new stylecow.Import(matches[2]);
	};

	stylecow.Import.prototype = Object.create(stylecow.Base, {

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
})(require('../index'));
