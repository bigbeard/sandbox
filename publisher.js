var subscribers = [];
var publishCount = 0;

var publisher = {
    publish: function (event) {
        subscribers.forEach(function (value) {
            if (value.eventTypes.indexOf('all') > -1) {
                value.publish(event);
            } else if (value.eventTypes.indexOf(event.type) > -1) {
                value.publish(event);
            }
        });

        publishCount++;
        if (publishCount % 1000 === 0) {
            console.log("publish count : ", publishCount);
        };

    },
    addSubscriber: function (subscriber) {
        console.log("subscriber added", subscriber);
        subscribers.push(subscriber);
    }
};

module.exports = publisher;
