var http = require('http'),
    sendEvent = require('./sendEvent');

exports.sendTrackingDataPacket = function() {
    sendEvent.send(createPacket());
    count++;
    console.log("Packets sent:", count);
};
var count = 0;
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

setInterval(sendTrackingDataPacket, 100);

