var net = require('net'),
    zmq = require('zeromq'),
    mongoDb = require('./mongoDb'),
    rulesEngine = require('./rulesEngine'),
    pullSocket = zmq.socket('pull');

var packetsReceived = 0;
var databaseNumber = 1;

pullSocket.on('message', function (msg) {
    var message = JSON.parse(msg);

    mongoDb.insert('event', databaseNumber, message, function (error) {
        if (error) {
            console.log("Failed to write event: ", error);
//            res.send("FAIL");
        } else {
//            res.send("OK");
            rulesEngine.publish(message);
        }
    });

    packetsReceived++;

    if (packetsReceived % 100 === 0) {
        console.log("Packets received: ", packetsReceived)
    }
});

rulesEngine.start();
pullSocket.connect('tcp://127.0.0.1:3000');
console.log('Server connected on 3000');

