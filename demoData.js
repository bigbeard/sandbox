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
    return { trackingUnitId: trackingUnitId, latitude: 53.8181, longitude: -1.508, speed: speed, type: "tracking" };
};
var createPacket = exports.createPacket;

setInterval(sendTrackingDataPacket, 1);
