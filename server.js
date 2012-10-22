var http = require('http'),
    publisher = require('./publisher'),
    subscribers = require('./subscribers'),
    db = require('./db'),
    mongoOutput = require('./outputs/mongoOutput');

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
        publisher.publish(packet);
    });
});

server.listen(3000, '127.0.0.1', function() {
    console.log('Server running at http://127.0.0.1:3000/');
    setUpEventSourceEngine();
    db.openDatabase();
});

var setUpEventSourceEngine = function () {
    subscribers.loadSubscribers(publisher);
    mongoOutput.loadOuputs();
};

