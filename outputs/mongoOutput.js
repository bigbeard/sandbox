var emitter = require("../emitter");
mongoDb = require("../db");

exports.loadOuputs = function () {
    emitter.on("speeding", function (event) {
        mongoDb.insert("speeding", event);
    });

    emitter.on("journey", function (event) {
        mongoDb.insert("journey", event);
    });

    emitter.on("event", function (event) {
        mongoDb.insert("event", event);
    });
};


