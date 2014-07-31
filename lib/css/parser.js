(function (css) {
	css.parser = {
		code: function (code, parent) {
			if (!parent) {
				parent = new css.Root();
			}

			var child = parent, status = ['selector'], buffer = '';
			
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
					nextChar = stringLine[col];

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
								case 'selector':
								case 'rules':
									var newChild;
									var matches = buffer.trim().match(/^@([^\s]+)\s(.*)$/m);

									if (matches) {
										newChild = new css.AtRule(matches[1]);
										buffer = matches[2];
									} else {
										newChild = new css.Rule();
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
								case 'selector':
									var newChild;

									if (buffer.indexOf('@import') !== -1) {
										newChild = css.Import.create(buffer.slice(0, -1));
									} else {
										newChild = new css.Rule;

										newChild.selector = buffer.slice(0, -1);
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
								child.add(css.Comment.create(buffer)).setData('sourceColumn', col).setData('sourceLine', line);
								buffer = '';
								status.shift();
							}
							break;

						default:
							if (!status.length) {
								status = ['selector'];
							}
					}
				}
			}

			return parent;
		},
		selector: function (code) {
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
						if (status[0] === 'parenthesis') {
							status.shift();
						}

						buffer += currChar;
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
								status[0] = 'relation'
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
})(require('../css'));
