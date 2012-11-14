var http = require('http'),
sendEvent = require('./sendEvent');

var packetCount = 0;
var numberOfPacketsToSend = process.argv[2];

exports.sendTrackingDataPacket = function() {
    for (var n = 0; n < 1000 ; n++) {
        sendEvent.send(createPacket());
        packetCount++;
    };
    console.log("Packets sent:", packetCount);
    if (numberOfPacketsToSend) {
        if (packetCount >= numberOfPacketsToSend) {
            clearInterval(timer);
        }
    }
};

var sendTrackingDataPacket = exports.sendTrackingDataPacket;

exports.createPacket = function() {
    var trackingUnitId = Math.floor(Math.random() * 12 ) + 1;
    var speed = Math.floor(Math.random() * 100);
    var statusCode = Math.floor(Math.random() * 3);
    var status;

    switch (statusCode) {
        case 0 :
            status = "stopped";
            break;
        case 1 :
            status = "driving";
            break;
        case 2 :
            status = "idling";
    };


    return {
        trackingUnitId: trackingUnitId.toString(),
        latitude: 53.8181,
        longitude: -1.508,
        speed: speed,
        type: "tracking",
        status: status,
        dateTime: new Date()
    };
};
var createPacket = exports.createPacket;

//var timer = setInterval(sendTrackingDataPacket, 100);

