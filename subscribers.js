var fs = require('fs'),
    walk = require('walk');

exports.loadSubscribers = function (publisher) {
    var walkOptions = {
        followLinks: false
    };

    var walker = walk.walk('./subscribers', walkOptions);

    walker.on("directories", function (root, dirStatsArray, next) {
        next();
    });

    walker.on("file", function (root, fileStats, next) {
        var filename = fileStats.name;
        console.log('filename:', filename);
        var subscriber = require('./subscribers/' + filename);

        if ((subscriber.publish) && (subscriber.output) && (subscriber.eventTypes)) {
            publisher.addSubscriber(subscriber);
        }

        next();
    });

    walker.on("errors", function (root, nodeStatsArray, next) {
        next();
    });

    walker.on("end", function () {
        console.log('all subscribers loaded');
    });
};
