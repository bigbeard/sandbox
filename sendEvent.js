var http = require('http');


require('http').globalAgent.maxSockets = 100;

module.exports = {
    send : function(packet) {
        var options = {
            host: '127.0.0.1',
            port: 3000,
            path: '/trackingData/event',
            method: 'POST',
            headers: { "content-type" : "application/json" }
        };

        var req = http.request(options, function(res) {
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        var data = JSON.stringify(packet);
        req.write(data);
        req.end();
    }
};

