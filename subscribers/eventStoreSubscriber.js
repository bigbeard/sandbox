var emitter = require('../emitter');

var eventStoreSubscriber = {
    eventTypes: [ "all" ],
    publish: function (event) {
        emitter.emit("event", outputData);
    }
};

module.exports = eventStoreSubscriber;
