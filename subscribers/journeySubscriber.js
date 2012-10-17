var mongoDb = require("../db"),
    coll = require("coll");

var journies = coll.Dict();
var vehicleStatuses = coll.Dict();

var isJourneyStart = function (event, currentStatus) {
    if (currentStatus === "stopped") {
        if ((event.status === "idling") || (event.status === "driving")) {
            return true;
        }
    }
    return false;
};

var isJourneyEnd = function (event, currentStatus) {
    if (event.status === "stopped") {
        if ((currentStatus === "idling") || (currentStatus === "driving")) {
            return true;
        }
    }
    return false;
};

var createJourneyAndStore  = function (event) {
    var newJourney = new journey();

    newJourney.trackingUnitId = event.trackingUnitId;
    newJourney.startDateTime = event.dateTime;

    journies.set(event.trackingUnitId, newJourney);
};

var endJourneyAndOutput = function (event, journeyToEnd) {
    journeyToEnd.endDateTime = event.dateTime;
    journies.remove(journeyToEnd.trackingUnitId);
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
        var currentStatus =  vehicleStatuses.get(event.trackingUnitId, "stopped");

        if (isJourneyStart(event, currentStatus)) {
            createJourneyAndStore(event);
        }

        if (isJourneyEnd(event, currentStatus)) {
            var journeyToProcess = journies.get(event.trackingUnitId, undefined);
            if (journeyToProcess) {
                endJourneyAndOutput(event, journeyToProcess);
            }
        }

        vehicleStatuses.set(event.trackingUnitId, event.status);
    },
    output: function (outputObject) {
        mongoDb.insert("journey", outputObject);
    }
};

module.exports = journeySubscriber;
