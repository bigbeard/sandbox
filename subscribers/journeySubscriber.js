var mongoDb = require("../db");
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
    journeySubscriber.output(journeyToEnd);
};

var journey = function() {
    this.trackingUnitId;
    this.startDateTime;
    this.totalIdlingTime;
    this.totalDrivingTime;
    this.endDateTime;
};

var journeySubscriber = {
    eventTypes: [ "tracking" ],
    publish: function (event) {
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
    },
    output: function (outputObject) {
        mongoDb.insert("journey", outputObject);
    }
};

module.exports = journeySubscriber;
