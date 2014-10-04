(function (stylecow) {

	stylecow.Error = function (message, data, prevError) {
		this.message = message;
		this.data = data;
		this.prevError = prevError;
	};

	stylecow.Error.prototype = {

		getFirstError: function () {
			if (this.prevError instanceof stylecow.Error) {
				return this.prevError.getFirstError();
			}

			return this;
		},

		toFullString: function () {
			var string = this.toString();

			if (this.prevError instanceof stylecow.Error) {
				string += '\n------------------\n' + this.prevError.toFullString();
			}

			return string;
		},

		toString: function () {
			var string = this.message;

			stylecow.utils.forEach(this.data, function (value, key) {
				string += '\n' + key + ': ' + value;
			});

			return string;
		},

		toCode: function () {
			var root = stylecow.Root.create('body>*{display:none;}');
			var rule = root.add(new stylecow.Rule());

			rule.content = [
				'content: "' + this.toString().replace(/\n/g, ' \\A ').replace(/"/, '\\"') + '"',
				'background: white',
				'color: black',
				'font-family: monospace',
				'white-space: pre'
			];
			rule.selector = 'body::before';
			
			return root;
		}
	};
})(require('./index'));
