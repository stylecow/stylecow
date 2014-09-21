(function (stylecow) {

	stylecow.utils = {
		forEach: function (items, callback, self) {
			if (!items) {
				return;
			}

			self = self || this;

			for (var k in items) {
				if (items.hasOwnProperty(k)) {
					callback.call(self, items[k], k);
				}
			}
		},

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
				buffer = '',
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
								status.unshift('parenthesis');
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

								if (string[col+1] === '/') {
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
			return stylecow.utils.explode(delimiter, string, limit)
				.map(function (value) {
					return value.trim();
				})
				.filter(function (value) {
					return value ? true : false;
				});
		},

		arrayUnique: function (array) {
			var i, k, a = [];

			for (i = array.length - 1; i >= 0; i--) {
				k = a.indexOf(array[i]);

				if (k !== -1) {
					a.splice(k, 1);
				}

				a.push(array[i]);
			}

			return a;
		},

		parseCode: function (code, parent) {
			if (!parent) {
				parent = new stylecow.Root();
			}

			var child = parent, status = ['root'], buffer = '';

			code = code.split('\n');
			code.unshift('');

			for (var line = 0, totalLines = code.length; line < totalLines; line++) {
				if (status[0] === 'comment') {
					code[line] += '\n';
				}

				var stringLine = code[line],
					col = 0,
					length = stringLine.length,
					currChar = null,
					previousChar = null,
					nextChar = stringLine[col],
					newChild;

				while (col < length) {
					previousChar = currChar;
					currChar = nextChar;
					col ++;
					nextChar = (col === length) ? null : stringLine[col];

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
									status.unshift('parenthesis');
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
								case 'root':
								case 'selector':
								case 'rules':
									var matches = buffer.trim().match(/^@([^\s]+)\s(.*)$/m);

									if (matches) {
										newChild = new stylecow.AtRule(matches[1]);
										buffer = matches[2];
									} else {
										newChild = new stylecow.Rule();
									}

									child = child.add(newChild).setData('sourceColumn', col).setData('sourceLine', line);
									child.selector = buffer.slice(0, -1);

									buffer = '';
									status.unshift('rules');
									break;
							}
							break;

						case '}':
							switch (status[0]) {
								case 'rules':
									buffer = buffer.slice(0, -1);

									if (buffer.trim()) {
										child.add(buffer).setData('sourceColumn', col).setData('sourceLine', line);
									}

									buffer = '';
									status.shift();
									child = child.parent;
									break;
							}
							break;

						case ';':
							switch (status[0]) {
								case 'root':
								case 'selector':

									if (buffer.indexOf('@import') !== -1) {
										newChild = stylecow.Import.create(buffer);
									} else {
										newChild = stylecow.Declaration.create(buffer);
									}

									newChild.setData('sourceColumn', col).setData('sourceLine', line);

									buffer = '';

									child.add(newChild);
									break;

								case 'rules':
									child.add(buffer.slice(0, -1)).setData('sourceColumn', col).setData('sourceLine', line);
									buffer = '';
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
								child.add(stylecow.Comment.create(buffer)).setData('sourceColumn', col).setData('sourceLine', line);
								buffer = '';
								status.shift();
							}
							break;

						default:
							if (!status.length) {
								status = ['root'];
							}
					}
				}
			}

			if (buffer.trim() && (status[0] === 'root')) {
				child.add(stylecow.Declaration.create(buffer));
			}

			return parent;
		},

		parseSelector: function (code) {
			if (!code) {
				return [];
			}

			var length = code.length,
				col = 0,
				pieces = [],
				status = [],
				buffer = '',
				previousChar = null,
				currChar = null;

			while (col < length) {
				previousChar = currChar;
				currChar = code[col];
				col++;

				switch (currChar) {
					case '(':
						if (status[0] !== 'quote') {
							status.unshift('parenthesis');
						}

						buffer += currChar;
						break;

					case ')':
						buffer += currChar;

						if (status[0] === 'parenthesis') {
							status.shift();
							pieces.push(buffer);
							buffer = '';
						}
						break;

					case '"':
						if (status[0] === 'quote') {
							status.shift();
						} else {
							status.unshift('quote');
						}

						buffer += currChar;
						break;

					case ' ':
						switch (status[0]) {
							case 'quote':
							case 'parenthesis':
								buffer += currChar;
								break;

							case 'space':
							case 'relation':
								break;

							default:
								status.unshift('space');

								if (buffer) {
									pieces.push(buffer);
									buffer = '';
								}

								buffer += currChar;
						}
						break;

					case '>':
					case '+':
					case '~':
						switch (status[0]) {
							case 'quote':
							case 'parenthesis':
								buffer += currChar;
								break;

							case 'space':
								status[0] = 'relation';
								buffer = currChar;
								break;

							default:
								status.unshift('relation');
								buffer += currChar;

						}
						break;

					case '.':
					case '#':
						switch (status[0]) {
							case 'quote':
							case 'parenthesis':
								break;

							case 'space':
							case 'relation':
								if (currChar !== ' ' && buffer) {
									pieces.push(buffer);
									status.shift();
									buffer = '';
								}
								break;

							default:
								if (buffer) {
									pieces.push(buffer);
									buffer = '';
								}

						}

						buffer += currChar;
						break;

					case ':':
						switch (status[0]) {
							case 'quote':
							case 'parenthesis':
								break;

							case 'space':
							case 'relation':
								if (currChar !== ' ' && buffer) {
									pieces.push(buffer);
									status.shift();
									buffer = '';
								}
								break;

							default:
								if (previousChar !== ':' && buffer) {
									pieces.push(buffer);
									buffer = '';
								}
						}

						buffer += currChar;
						break;

					default:
						switch (status[0]) {
							case 'space':
							case 'relation':
								if (currChar !== ' ' && buffer) {
									pieces.push(buffer);
									status.shift();
									buffer = '';
								}
								break;
						}

						buffer += currChar;
				}
			}

			if (buffer) {
				pieces.push(buffer);
			}

			return pieces;
		}
	};

})(require('./index'));
