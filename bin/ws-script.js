(function () {
	"use strict";

	var ws, styles = {}, links = Array.prototype.slice.call(document.querySelectorAll('link[rel="stylesheet"]'));

	function getLink(url) {
		var link = links.filter(function (node) {
				return (node.href.substr(-(url.length)) === url);
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
						file.baseUrl = link.href;

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
			}
		}
	}

	setInterval(socket, 1000);
})();