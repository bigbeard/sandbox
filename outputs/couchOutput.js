var emitter = require("../emitter"),
nano = require('nano')('http://localhost:5984');


nano.db.create("speeding");
nano.db.create("journey");
nano.db.create("event");

var speedingDb = nano.use("speeding");
var journeyDb = nano.use("journey");
var eventDb = nano.use("event");

exports.loadOutputs = function () {
    emitter.on("speeding", function (event) {
        speedingDb.insert(event);
    });

    emitter.on("journey", function (event) {
        journeyDb.insert(event);
    });

    emitter.on("event", function (event) {
        eventDb.insert(event);
    });
};



