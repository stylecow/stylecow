(function () {
  var ws, style = document.createElement('style');

  document.head.appendChild(style);

  function socket () {
    if (!ws || ws.readyState !== 1) {
      ws = new WebSocket('ws://127.0.0.1:8080');

      ws.onmessage = function (e) {
        var data = JSON.parse(e.data);
        style.innerHTML = data.code;

        if (data.output) {
          var link = document.querySelector('link[rel="stylesheet"][href$="' + data.output + '"]');

          if (link) {
            link.parentNode.removeChild(link);
          }
        }
      }
    }
  }

  setInterval(socket, 1000);
})();