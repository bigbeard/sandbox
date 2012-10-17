var mongoDb = require('../db');

var eventStoreSubscriber = {
    eventTypes: [ "all" ],
    publish: function (event) {
        this.output(event);
    },
    output: function (outputData) {
       mongoDb.insert("events", outputData);
    }
};

module.exports = eventStoreSubscriber;
