(function (stylecow) {

	stylecow.Error = function (message, data) {
		this.message = message;
		this.data = data;
	};

	stylecow.Error.prototype = {

		toString: function () {
			var string = this.message;

			for (var key in this.data) {
				if (this.data.hasOwnProperty(key)) {
					string += '\n' + key + ': ' + this.data[key];
				}
			}

			return string;
		},

		toCode: function () {
			var code = 'body > * {'
					+ 'display: none;'
				+ '}'
				+ 'body::before {'
					+ 'content: "' + this.toString().replace(/\n/g, ' \\A ').replace(/"/, '\\"') + '";'
					+ 'background: white;'
					+ 'color: black;'
					+ 'font-family: monospace;'
					+ 'white-space: pre;'
				+ '}';

			return code;
		}
	};
})(require('./index'));
