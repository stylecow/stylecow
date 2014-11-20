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
					if (this.data[key] instanceof Error) {
						string += printError(this.data[key]);
					} else {
						string += printInfo(key, this.data[key]);
					}
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

	function printInfo (key, name) {
		return '\n' + key + ': ' + name;
	}

	function printError (error) {
		var string = '\nError: ' + error.message;

		if (error.fileName) {
			string += '\nError file: ' + error.fileName;
		}

		if (error.lineNumber) {
			string += '\nError line: ' + error.lineNumber;
		}

		string += '\n' + error.stack;

		return string;
	}
})(require('./index'));
