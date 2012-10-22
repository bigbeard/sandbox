var assert = require('assert'),
sinon = require('sinon'),
journeySubscriber = require('../subscribers/journeySubscriber'),
emitter = require('../emitter');

describe('Create journey.', function() {
    it('One vehicle. Should return 1 populated journey object', function (done) {
        try {
            emitter.on("journey", function (journey) {
                assert.equal(journey.startDateTime.getTime(), new Date(2001, 1, 1, 12, 0).getTime());
                assert.equal(journey.endDateTime.getTime(), new Date(2001, 1, 1, 12, 3).getTime());
                assert.equal(journey.drivingTimeSeconds, 120);
                assert.equal(journey.idlingTimeSeconds, 60);
                done();
            });

            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 11, 59), status: "stopped" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 0), status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 1), status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 2), status: "idling" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 3), status: "stopped" });
        } finally {
            emitter.removeAllListeners("journey");
        }
    });
    it('Two vehicles. Should return 2 populated journey objects', function (done) {
        var eventCount = 0;
        try {
            emitter.on("journey", function (journey) {
                if (eventCount === 0) {
                    assert.equal(journey.trackingUnitId, 1);
                    assert.equal(journey.startDateTime.getTime(), new Date(2001, 1, 1, 12, 0).getTime());
                    assert.equal(journey.endDateTime.getTime(), new Date(2001, 1, 1, 12, 2).getTime());
                    assert.equal(journey.drivingTimeSeconds, 120);
                    assert.equal(journey.idlingTimeSeconds, 0)

                    eventCount++;
                } else if (eventCount === 1) {
                    assert.equal(journey.trackingUnitId, 2);
                    assert.equal(journey.startDateTime.getTime(), new Date(2001, 1, 1, 12, 1).getTime());
                    assert.equal(journey.endDateTime.getTime(), new Date(2001, 1, 1, 12, 3).getTime());
                    assert.equal(journey.drivingTimeSeconds, 120);
                    assert.equal(journey.idlingTimeSeconds, 0);
                    done();
                }
            });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 0), status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "2", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 1), status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 2), status: "stopped" });
            journeySubscriber.publish({ trackingUnitId: "2", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 3), status: "stopped" });
        } finally {
            emitter.removeAllListeners("journey");
        }
    });
});


