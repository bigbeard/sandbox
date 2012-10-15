var mongoDb = require('./db');

exports.subscribeToEvents = function (publisher) {
    publisher.addSubscriber(new eventStoreSubscriber());
    publisher.addSubscriber(new speedSubscriber());
};

var speedSubscriber = function () {
    this.eventTypes = [ "tracking" ];

    this.publish = function (event) {
        if (event.speed > 50) {
            console.log("speeding: ", event.speed);
            mongoDb.insert("speeding", event);
        }
    };
};

var eventStoreSubscriber = function () {
    this.eventTypes = [ "all" ];

    this.publish = function (event) {
        mongoDb.insert("events", event);
    };
};


