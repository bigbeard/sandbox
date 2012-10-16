var mongoDb = require("./db");

exports.eventTypes = [ "tracking" ];
var journies = [];

var isStart = function (event) {
    if (event.status === "ign_on") {
        return true;
    }

    return false;
};

var isEnd = function (event) {
    if (event.status === "ign_off") {
        return true;
    }

    return false;
};

var createJourneyAndAddToArray  = function (event) {
    var newJourney = new journey();

    newJourney.trackingUnitId = event.trackingUnitId;
    newJourney.startDateTime = event.dateTime;

    journies.push(newJourney);
};

var endJourneyAndOutput = function (event, journeyToEnd) {
    journeyToEnd.endDateTime = event.dateTime;
    journies.splice(journies.indexOf(journeyToEnd), 1);
    exports.output(journeyToEnd);
};

exports.publish = function (event) {
    if (isStart(event)) {
        createJourneyAndAddToArray(event);
    }

    if (isEnd(event)) {
        journies.forEach(function (journeyToProcess) {
            if (journeyToProcess.trackingUnitId === event.trackingUnitId) {
                endJourneyAndOutput(event, journeyToProcess);
            };
        });
    }
};

exports.output = function (outputObject) {
    mongoDb.insert("journey", outputObject);
};

var journey = function() {
    this.trackingUnitId;
    this.startDateTime;
    this.totalIdlingTime;
    this.totalDrivingTime;
    this.endDateTime;
};
