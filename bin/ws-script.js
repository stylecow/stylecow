(function () {
	"use strict";

	var ws, styles = {}, errorStyle, links = Array.prototype.slice.call(document.querySelectorAll('link[rel="stylesheet"]'));

	function getLink(url) {
		while (url.indexOf('../') !== -1) {
			url = url.replace('../', '');
		}

		var link = links.filter(function (node) {
				var href = node.href;

				if (href.indexOf('?') !== -1) {
					href = href.split('?', 2).shift();
				}

				return (href.substr(-(url.length)) === url);
			}).pop();

		if (link) {
			links.splice(links.indexOf(link), 1);
		}

		return link;
	}

	function socket () {
		if (ws && ws.readyState !== 3) {
			return true;
		}

		ws = new WebSocket('ws://127.0.0.1:8080');

		ws.onmessage = function (e) {
			var data = JSON.parse(e.data);

			if (data.subject === 'connection') {
				data.files.forEach(function (file) {
					var link = getLink(file.output);

					if (link) {
						if (link.href.indexOf('?') !== -1) {
							file.baseUrl = link.href.split('?', 2).shift();
						} else {
							file.baseUrl = link.href;
						}

						var style = document.createElement('style');
						document.head.appendChild(style);

						styles[file.baseUrl] = {
							style: style,
							link: link
						};
					
						console.log('Stylecow live reload is syncing: ' + file.baseUrl);
					}
				});

				ws.send(JSON.stringify({
					subject: 'connection',
					agent: navigator.userAgent,
					files: data.files
				}));

				return;
			}

			if (data.subject === 'code') {
				var style = styles[data.baseUrl];

				style.style.innerHTML = data.code;

				if (style.link) {
					style.link.parentNode.removeChild(style.link);
					style.link = null;
				}

				if (errorStyle) {
					errorStyle.innerHTML = '';
				}
			}

			if (data.subject === 'error') {
				if (!errorStyle) {
					errorStyle = document.createElement('style');
					document.head.appendChild(errorStyle);
				}

				errorStyle.innerHTML = data.code;
			}
		}
	}

	setInterval(socket, 1000);
})();