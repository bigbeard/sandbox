var mongoDb = require('./db'),
    journeySubscriber = require('./journeySubscriber');

exports.subscribeToEvents = function (publisher) {
    publisher.addSubscriber(new eventStoreSubscriber());
    publisher.addSubscriber(new speedSubscriber());
    publisher.addSubscriber(journeySubscriber);
};

var speedSubscriber = function () {
    this.eventTypes = [ "tracking" ];

    this.publish = function (event) {
        if (event.speed > 50) {
            console.log("speeding: ", event.speed);
            this.output(event);
        }
    };

    this.output = function (outputData) {
       mongoDb.insert("speeding", outputData);
    };
};

var eventStoreSubscriber = function () {
    this.eventTypes = [ "all" ];

    this.publish = function (event) {
        this.output(event);
    };

    this.output = function (outputData) {
       mongoDb.insert("events", outputData);
    };
};


