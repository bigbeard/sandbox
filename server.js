var rulesEngine = require('./rulesEngine'),
    mongoDb = require('./mongoDb'),
    express = require('express'),
    cluster = require('cluster');

require('http').globalAgent.maxSockets = 100000;

var tableNumber = 0;
var databaseNumber = 1;

var createServer = function (port) {
    var server = express();

    server.configure(function(){
        server.use(express.bodyParser());
        server.set('view engine', 'jshtml');
    });

    server.configure('development', function(){
        server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    server.configure('production', function(){
        server.use(express.errorHandler());
    });

    var requestCount = 0;

    server.post('/trackingData/event', function (req, res) {
        //console.log("Http request: ", requestCount);
        requestCount++;

        var packet = req.body;
        tableName = "event" + tableNumber;

        mongoDb.insert(tableName, databaseNumber, packet, function (error) {
            if (error) {
                console.log("Failed to write event: ", error);
                res.send("FAIL");
            } else {
                res.send("OK");
                rulesEngine.publish(packet);
            }
        });

        res.send("OK");
        if (requestCount % 1000 === 0) {
            console.log("Request count = ", requestCount);
        }
        tableNumber++;
        if (tableNumber > 9) {
            tableNumber = 0;
        }

        databaseNumber++;
        if (databaseNumber > 2) {
            databaseNumber = 1;
        }
    });

    server.listen(port, function(){
        console.log("Express server listening on port %d in %s mode", port, server.settings.env);
        rulesEngine.start();
    });
};

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < 1; i++) {
        cluster.fork();
    }

    cluster.on('death', function(worker) {
            console.log('worker ' + worker.pid + ' died');
            });
} else {
    // Worker processes have a http server.
    createServer(3000);
}

