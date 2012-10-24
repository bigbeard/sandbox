var http = require('http'),
    queue = require('./queue'),
    rulesEngine = require('./rulesEngine');

var server = http.createServer();

server.on('request', function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain','charset': 'utf8'});
    res.end();

    var data = "";

    req.on('data', function(chunk) {
        data += chunk;
    });

    req.on('end', function() {
        var packet = JSON.parse(data);
        queue.send(packet);
    });
});

server.listen(3000, '127.0.0.1', function() {
    console.log('Server running at http://127.0.0.1:3000/');
    rulesEngine.start();
});

