(function (stylecow) {

	stylecow.Document = function () {
		this.type = 'Document';
	};

	stylecow.Document.prototype = Object.create(stylecow.Base, {

		toString: {
			value: function () {
				var code = stylecow.Rule.prototype.toString.call(this);

				return code ? '@document ' + code : '';
			}
		},

		toCode: {
			value: function () {
				var code = stylecow.Rule.prototype.toCode.call(this);

				return code ? '@document ' + code : '';
			}
		}
	});
})(require('../index'));
