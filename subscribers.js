var fs = require('fs'),
walk = require('walk');


var exclude = "eventStoreSubscriber.js";

var subscribers = {
    loadSubscribers: function (publisher) {
        var subscriber1 = require('./subscribers/journeySubscriber.js');
        publisher.addSubscriber(subscriber1);
        var subscriber2 = require('./subscribers/speedSubscriber.js');
        publisher.addSubscriber(subscriber2);
/*
        var walkOptions = {
            followLinks: false
        };

        var walker = walk.walk('./subscribers', walkOptions);

        walker.on("directories", function (root, dirStatsArray, next) {
            next();
        });

        walker.on("file", function (root, fileStats, next) {
            var filename = fileStats.name;

            if (filename != exclude) {
                console.log('filename:', filename);
                var subscriber = require('./subscribers/' + filename);

                if ((subscriber.publish) && (subscriber.eventTypes)) {
                    publisher.addSubscriber(subscriber);
                }
            }
            next();
        });

        walker.on("errors", function (root, nodeStatsArray, next) {
            next();
        });

        walker.on("end", function () {
            console.log('all subscribers loaded');
        });
*/
    }
};

module.exports = subscribers;
