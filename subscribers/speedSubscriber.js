var mongoDb = require('../db'),
    emitter = require('../emitter');

var speedSubscriber = {
    eventTypes: [ "tracking" ],
    output: function (outputData) {
        emitter.emit("speeding", outputData);
    },
    publish: function (event) {
        if (event.speed > 50) {
            console.log("speeding: ", event.speed, event.trackingUnitId);
            this.output(event);
        }
    }
};

module.exports = speedSubscriber;
