var mongoDb = require('../db');

var speedSubscriber = {
    eventTypes: [ "tracking" ],
    publish: function (event) {
        if (event.speed > 50) {
            console.log("speeding: ", event.speed);
            output(event);
        }
    },
    output: function (outputData) {
       mongoDb.insert("speeding", outputData);
    }
};

module.exports = speedSubscriber;
