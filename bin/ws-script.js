(function () {
  var ws, style = document.createElement('style');

  document.head.appendChild(style);

  function socket () {
    if (!ws || ws.readyState !== 1) {
      ws = new WebSocket('ws://127.0.0.1:8080');

      ws.onmessage = function (e) {
        var data = JSON.parse(e.data);
        var link;

        if (data.output) {
          Array.prototype.forEach.call(
            document.querySelectorAll('link[rel="stylesheet"]'),
            function (node) {
              var href = node.href;

              if (node.href.substr(-(data.output.length)) === data.output) {
                link = node;
              }
            }
          )
        }

        if (data.subject === 'baseUrl') {
          if (!link) {
            console.error('Stylecow live reload error: No stylesheet link found in the document for the file ' + data.output);
            return;
          }

          ws.send(JSON.stringify({
            subject: 'baseUrl',
            baseUrl: link.href
          }));
        } else if (data.subject === 'code') {
          style.innerHTML = data.code;

          if (link) {
            link.parentNode.removeChild(link);
          }
        }
      }
    }
  }

  setInterval(socket, 1000);
})();