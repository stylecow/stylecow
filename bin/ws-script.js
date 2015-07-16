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

                        styles[file.baseUrl] = {
                            init: false,
                            node: link
                        };
                    
                        console.log('Stylecow -> connection: ' + file.baseUrl);
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

                if (!style.init) {
                    var newnode = document.createElement('style');
                    style.node.parentNode.replaceChild(newnode, style.node);
                    style.node = newnode;
                    style.init = true;
                }

                style.node.innerHTML = data.code;

                if (errorStyle) {
                    errorStyle.innerHTML = '';
                }

                console.log('Stylecow -> reload: ' + data.baseUrl);

                return;
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

    console.log('                                                                       '
            + '\n SS                                                                  SS'
            + '\n SSS                                                                SSS'
            + '\n SSSS                                                              SSSS'
            + '\n  SSSS                                                            SSSS '
            + '\n  SSSSS                                                          SSSSS '
            + '\n   SSSSSS                                                       SSSSS  '
            + '\n    SSSSSS                                                    SSSSSS   '
            + '\n     SSSSSSS                                                SSSSSSS    '
            + '\n      SSSSSSSS                 SSSSSSSSSS                SSSSSSSSS     '
            + '\n       SSSSSSSSSSS      SSSSSSSSSSSSSSSSSSSSSSSS      SSSSSSSSSSS      '
            + '\n        SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS       '
            + '\n         SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS         '
            + '\n           SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS          '
            + '\n             SSSSSSSSSSSSSSSSSSSS        SSSSSSSSSSSSSSSSS             '
            + '\n                 SSSSSSSSSSSSSSSS          SSSSSSSSSSS                 '
            + '\n                       SSSSSSSSSSS                                     '
            + '\n                       SSSSSSSSSSSSSSSSS                               '
            + '\n                        SSSSSSSSSSSSSSSSSSSS                           '
            + '\n                         SSSSSSSSSSSSSSSSSSSSS                         '
            + '\n                           SSSSSSSSSSSSSSSSSSSSS                       '
            + '\n                               SSSSSSSSSSSSSSSSSS                      '
            + '\n                                    SSSSSSSSSSSSS                      '
            + '\n                                       SSSSSSSSSS                      '
            + '\n                         SSSS          SSSSSSSSSS                      '
            + '\n                        SSSSSSS     SSSSSSSSSSSS                       '
            + '\n                       SSSSSSSSSSSSSSSSSSSSSSSSS                       '
            + '\n                     SSSSSSSSSSSSSSSSSSSSSSSSSS                        '
            + '\n                       SSSSSSSSSSSSSSSSSSSSSSS                         '
            + '\n                          SSSSSSSSSSSSSSSSSS                           '
            + '\n                               SSSSSSSS                                '
            + '\n                                                                       '
            + '\n                 STYLECOW - Modern css for all browsers                ');

    setInterval(socket, 1000);
})();