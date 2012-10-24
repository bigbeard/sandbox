var subscribers = require('./subscribers'),
    // mongoOutput = require('./outputs/mongoOutput'),
    couchOutput = require('./outputs/couchOutput'),
    queue = require('./queue'),
    publisher = require('./publisher');

var rulesEngine = {
    start: function () {
       subscribers.loadSubscribers(publisher);
        // mongoOutput.loadOutputs();
        couchOutput.loadOutputs();

        queue.startReceive();

        queue.on("receive", function (message) {
//            console.log("rulesEngine receive: ", message);
            publisher.publish(message);
        });
    }

};

module.exports = rulesEngine;
