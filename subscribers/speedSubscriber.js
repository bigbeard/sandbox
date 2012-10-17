var mongoDb = require('../db');

var speedSubscriber = {
    eventTypes: [ "tracking" ],
    output: function (outputData) {
        mongoDb.insert("speeding", outputData);
    },
    publish: function (event) {
        if (event.speed > 50) {
            console.log("speeding: ", event.speed);
            this.output(event);
        }
    }
};

module.exports = speedSubscriber;
