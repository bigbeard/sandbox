var emitter = require('../emitter');

var eventStoreSubscriber = {
    eventTypes: [ "all" ],
    publish: function (event) {
        this.output(event);
    },
    output: function (outputData) {
        emitter.emit("event", outputData);
    }
};

module.exports = eventStoreSubscriber;
