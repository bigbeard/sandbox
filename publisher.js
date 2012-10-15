var subscribers = [];

exports.publish = function (event) {
    subscribers.forEach(function(value) {
        if (value.eventTypes.indexOf('all') > -1) {
            value.publish(event);
        } else if (value.eventTypes.indexOf(event.type) > -1) {
            value.publish(event);
        }
    });
};

exports.addSubscriber = function (subscriber) {
    console.log("subscriber added", subscriber);
    subscribers.push(subscriber);
};

