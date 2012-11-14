var demoData = require('./demoData'),
    net = require('net'),
    zmq = require('zeromq'),
    pushSocket = zmq.socket('push');

var packetCount = 0;
//var numberOfPacketsToSend = process.argv[2];


var sendTrackingDataPacket = function() {
    for (var i = 0 ; i < 1000 ; i++) {
        pushSocket.send(JSON.stringify(demoData.createPacket()));
//        pushSocket.send(demoData.createPacket());
        packetCount++;

        if (packetCount % 100 === 0) {
            console.log("Packets sent: ", packetCount);
        }
    }
};

var connectToServer = function () {
    pushSocket.bindSync('tcp://127.0.0.1:3000');
    console.log('Client connected to 3000');

    setInterval(sendTrackingDataPacket, 100);
};


connectToServer();

