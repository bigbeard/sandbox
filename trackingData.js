var http = require('http'),
    sendEvent = require('./sendEvent');

exports.sendTrackingDataPacket = function() {
    sendEvent.send(createPacket());
};
var sendTrackingDataPacket = exports.sendTrackingDataPacket;

exports.createPacket = function() {
    var trackingUnitId = Math.floor(Math.random() * 12 ) + 1;
    return { id: trackingUnitId, latitude: 53.8181, longitude: -1.508, speed: 53 };
};
var createPacket = exports.createPacket;

exports.sendData = function() {
    setInterval(sendTrackingDataPacket, 1000);
};

