var emitter = require("../emitter");
mongoDb = require("../mongoDb");

exports.loadOutputs = function () {
    emitter.on("speeding", function (event) {
        mongoDb.insert("speeding", 1, event);
    });

    emitter.on("journey", function (event) {
        mongoDb.insert("journey", 1, event);
    });

    emitter.on("event", function (event) {
        mongoDb.insert("event", 1, event);
    });

    console.log("Mongo outputs loaded");
};


