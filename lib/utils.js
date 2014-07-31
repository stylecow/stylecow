var utils = {
	explode: function (delimiter, string, limit) {
		if (!string) {
			return [];
		}

		if (!(delimiter instanceof Function)) {
			var stringDelimiter = delimiter;

			delimiter = function (buffer, currChar, array) {
				if (currChar === stringDelimiter) {
					array.push(buffer);
					return true;
				}
			};
		}

		var col = 0,
			length = string.length,
			currChar = null,
			previousChar = null,
			nextChar = string[col],
			buffer = '';
			status = [],
			array = [];

		while (col < length) {
			previousChar = currChar;
			currChar = nextChar;
			col ++;
			nextChar = (col === length) ? null : string[col];

			if (!status.length && delimiter(buffer, currChar, array)) {
				buffer = '';

				if (array.length === limit -1) {
					array.push(string.substr(col));
					break;
				}

				continue;
			}

			buffer += currChar;

			switch (currChar) {
				case '"':
					switch (status[0]) {
						case 'simpleQuote':
						case 'comment':
							break;

						case 'doubleQuote':
							if (previousChar !== '\\') {
								status.shift();
							}
							break;

						default:
							status.unshift('doubleQuote');
					}
					break;

				case "'":
					switch (status[0]) {
						case 'doubleQuote':
						case 'comment':
							break;

						case 'simpleQuote':
							if (previousChar !== '\\') {
								status.shift();
							}
							break;

						default:
							status.unshift('simpleQuote');
					}
					break;

				case '(':
					switch (status[0]) {
						case 'simpleQuote':
						case 'doubleQuote':
						case 'comment':
							break;

						default:
							status.unshift('parenthesis')
					}
					break;

				case ')':
					switch (status[0]) {
						case 'parenthesis':
							status.shift();
							break;
					}
					break;

				case '{':
					switch (status[0]) {
						case 'simpleQuote':
						case 'doubleQuote':
						case 'comment':
							break;

						default:
							status.unshift('brackets');
					}
					break;

				case '}':
					switch (status[0]) {
						case 'brackets':
							status.shift();
							break;
					}
					break;

				case ';':
					switch (status[0]) {
						case 'simpleQuote':
						case 'doubleQuote':
						case 'comment':
							break;
					}
					break;

				case '/':
					if (status[0] !== 'comment') {
						if (nextChar === '*') {
							status.unshift('comment');
							
							var nextCol = col+1;
							var nextNextChar = (nextCol === length) ? null : stringLine[nextCol];

							if (nextNextChar === '/') {
								col++;
							}
						}
					} else if (previousChar === '*') {
						status.shift();
					}
					break;
			}
		}

		if (buffer) {
			array.push(buffer);
		}

		return array;
	},
	explodeTrim: function (delimiter, string, limit) {
		return utils.explode(delimiter, string, limit)
			.map(function (value) {
				return value.trim();
			})
			.filter(function (value) {
				return value ? true : false;
			});
	},
	needFix: function (element, disablePlugin) {
		if (!disablePlugin) {
			return true;
		}

		for (var browser in disablePlugin) {
			var minSupport = element.getData(browser);

			if (minSupport = true || (minSupport !== false && disablePlugin[browser] !== false && minSupport < disablePlugin[browser])) {
				return true;
			}
		}

		return false;
	},
	arrayUnique: function (array) {
		var i, k;

		for (i = array.length - 1; i >= 0; i--) {
			k = array.indexOf(array[i]);

			if (i !== k) {
				array.splice(k, 1);
				--i;
			}
		}
	}
};

module.exports = utils;
