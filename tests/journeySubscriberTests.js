var assert = require('assert'),
    sinon = require('sinon'),
    journeySubscriber = require('../subscribers/journeySubscriber');

describe('Create journey.', function() {
    it('One vehicle. Should return 1 populated journey object', function () {

        var stub = sinon.stub(journeySubscriber, "output");
        try {
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: "01/01/01 11:59:00", status: "stopped" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: "01/01/01 12:00:00", status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: "01/01/01 12:01:00", status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: "01/01/01 12:02:00", status: "idling" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: "01/01/01 12:03:00", status: "stopped" });

            assert(stub.calledOnce === true);
            var journey = stub.getCall(0).args[0];
            assert.equal(journey.startDateTime, "01/01/01 12:00:00");
            assert.equal(journey.endDateTime, "01/01/01 12:03:00");
        } finally {
            journeySubscriber.output.restore();
        }
    });
    it('Two vehicles. Should return 2 populated journey objects', function () {
        try {
            var stub = sinon.stub(journeySubscriber, "output");
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: "01/01/01 12:00:00", status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "2", type: "tracking", dateTime: "01/01/01 12:01:00", status: "driving" });
            journeySubscriber.publish({ trackingUnitId: "1", type: "tracking", dateTime: "01/01/01 12:02:00", status: "stopped" });
            journeySubscriber.publish({ trackingUnitId: "2", type: "tracking", dateTime: "01/01/01 12:03:00", status: "stopped" });

            var journey1 = stub.getCall(0).args[0];
            var journey2 = stub.getCall(1).args[0];

            assert.equal(journey1.trackingUnitId, 1);
            assert.equal(journey1.startDateTime, "01/01/01 12:00:00");
            assert.equal(journey1.endDateTime, "01/01/01 12:02:00");

            assert.equal(journey2.trackingUnitId, 2);
            assert.equal(journey2.startDateTime, "01/01/01 12:01:00");
            assert.equal(journey2.endDateTime, "01/01/01 12:03:00");
        } finally {
            journeySubscriber.output.restore();
        }
    });
});


