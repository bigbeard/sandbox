var assert = require('assert'),
    sinon = require('sinon'),
    journeySubscriber = require('../subscribers/journeySubscriber');

describe('Create journey.', function() {
    it('One vehicle. Should return 1 populated journey object', function () {
        var stub = sinon.stub(journeySubscriber, "output");
        try {
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 11, 59), status: "stopped" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 0), status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 1), status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 2), status: "idling" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 3), status: "stopped" });

            assert(stub.calledOnce === true);
            var journey = stub.getCall(0).args[0];
            assert.equal(journey.startDateTime.getTime(), new Date(2001, 1, 1, 12, 0).getTime());
            assert.equal(journey.endDateTime.getTime(), new Date(2001, 1, 1, 12, 3).getTime());
            assert.equal(journey.drivingTimeSeconds, 120);
            assert.equal(journey.idlingTimeSeconds, 60);
        } finally {
            journeySubscriber.output.restore();
        }
    });
    it('Two vehicles. Should return 2 populated journey objects', function () {
        try {
            var stub = sinon.stub(journeySubscriber, "output");
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 0), status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "2", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 1), status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 2), status: "stopped" });
            journeySubscriber.publish({ trackingUnitId: "2", type: "tracking", dateTime: new Date(2001, 1, 1, 12, 3), status: "stopped" });

            var journey1 = stub.getCall(0).args[0];
            var journey2 = stub.getCall(1).args[0];

            assert.equal(journey1.trackingUnitId, 1);
            assert.equal(journey1.startDateTime.getTime(), new Date(2001, 1, 1, 12, 0).getTime());
            assert.equal(journey1.endDateTime.getTime(), new Date(2001, 1, 1, 12, 2).getTime());
            assert.equal(journey1.drivingTimeSeconds, 120);
            assert.equal(journey1.idlingTimeSeconds, 0)

            assert.equal(journey2.trackingUnitId, 2);
            assert.equal(journey2.startDateTime.getTime(), new Date(2001, 1, 1, 12, 1).getTime());
            assert.equal(journey2.endDateTime.getTime(), new Date(2001, 1, 1, 12, 3).getTime());
            assert.equal(journey2.drivingTimeSeconds, 120);
            assert.equal(journey2.idlingTimeSeconds, 0);
        } finally {
            journeySubscriber.output.restore();
        }
    });
});


