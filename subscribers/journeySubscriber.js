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

var addTimesToJourney = function (event, previousEvent, journey) {
    if (previousEvent.status === "driving") {
        journey.drivingTimeSeconds += Math.round((event.dateTime.getTime() - previousEvent.dateTime.getTime()) / 1000);
    }

    if (previousEvent.status === "idling") {
        journey.idlingTimeSeconds += Math.round((event.dateTime.getTime() - previousEvent.dateTime.getTime()) / 1000);
    }
};

var journey = function() {
    this.trackingUnitId;
    this.startDateTime;
    this.idlingTimeSeconds = 0;
    this.drivingTimeSeconds = 0;
    this.endDateTime;
};

var journeySubscriber = {
    eventTypes: [ "tracking" ],
    publish: function (event) {
        var previousEvent =  vehicleStatuses.get(event.trackingUnitId, undefined);
        var currentStatus = "stopped";
        if (previousEvent) {
            currentStatus = previousEvent.status;
        }
        var existingJourney = journies.get(event.trackingUnitId, undefined);

        if (isJourneyStart(event, currentStatus)) {
            createJourneyAndStore(event);
        } else if (isJourneyEnd(event, currentStatus)) {
            if (existingJourney) {
                addTimesToJourney(event, previousEvent, existingJourney);
                endJourneyAndOutput(event, existingJourney);
            }
        } else {
            if (existingJourney) {
                addTimesToJourney(event, previousEvent, existingJourney);
            }
        }

        vehicleStatuses.set(event.trackingUnitId, event);
    },
    output: function (outputObject) {
        console.log("Journey Event");
        mongoDb.insert("journey", outputObject);
    }
};

module.exports = journeySubscriber;
