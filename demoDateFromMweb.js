var soap = require("soap"),
sendEvent = require("./sendEvent"),
fs = require('fs'),
coll = require('coll')
config = require('config');

var vehicleLastEvents = coll.Dict();

var buildAndSendPacket = function (vehicle) {
    var packet = {
        dateTime: new Date(vehicle.lastUpdated),
        trackingUnitId: vehicle.registration,
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
        speed: vehicle.speedKilometres,
        status: vehicle.currentStatus,
        type: "tracking"
    };
    sendEvent.send(packet);
};

var getAndSendTrackingData = function () {
    soap.createClient(config.liveUrl, function(err, client) {
        var args = { login: [config.username], password: [config.password]};

        client.getVehicleUpdateV2(args, function(err, result) {
            var vehicles = result.getVehicleUpdateV2Result[0].VehicleV2;

            vehicles.forEach(function (vehicle) {
                vehicleLastEvent = vehicleLastEvents.get(vehicle.registration, undefined);
                if (vehicleLastEvent) {
                    if (new Date(vehicle.lastUpdated).getTime() > new Date(vehicleLastEvent.lastUpdated).getTime()) {
                        buildAndSendPacket(vehicle);
                    }
                } else {
                    buildAndSendPacket(vehicle);
                }
                vehicleLastEvents.set(vehicle.registration, vehicle);
            });
            console.log("Data fetched and processed", new Date().toISOString());
        });
    });
};

setInterval(getAndSendTrackingData, 10000);

