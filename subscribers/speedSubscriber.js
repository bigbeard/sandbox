var emitter = require('../emitter');

var speedSubscriber = {
    eventTypes: [ "tracking" ],
    publish: function (event) {
        if (event.speed > 90) {
            //console.log("speeding: ", event.speed, event.trackingUnitId);
            emitter.emit("speeding", event);
        }
    }
};

module.exports = speedSubscriber;
