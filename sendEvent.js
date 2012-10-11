var http = require('http');

exports.send = function(packet) {
    var options = {
        host: '127.0.0.1',
        port: 3000,
        path: '/trackingData',
        method: 'POST'
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(JSON.stringify(packet));
    req.end();
};
