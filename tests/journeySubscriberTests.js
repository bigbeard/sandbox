var assert = require('assert'),
    sinon = require('sinon'),
    journeySubscriber = require('../journeySubscriber');

describe('Create journey.', function() {
    it('One vehicle. Should return 1 populated journey object', function () {
        var stub = sinon.stub(journeySubscriber, "output");
        journeySubscriber.publish({ trackingUnitId: 1, type: "tracking", dateTime: "01/01/01 12:00:00", status: "ign_on" });
        journeySubscriber.publish({ trackingUnitId: 1, type: "tracking", dateTime: "01/01/01 12:01:00", status: "idling" });
        journeySubscriber.publish({ trackingUnitId: 1, type: "tracking", dateTime: "01/01/01 12:02:00", status: "driving" });
        journeySubscriber.publish({ trackingUnitId: 1, type: "tracking", dateTime: "01/01/01 12:03:00", status: "ign_off" });

        assert(stub.calledOnce === true);
        var journey = stub.getCall(0).args[0];

        assert("01/01/01 12:00:00", journey.startDateTime);
        assert("01/01/01 12:03:00", journey.endDateTime);

        journeySubscriber.output.restore();
    });

    it('Two vehicles. Should return 2 populated journey objects', function () {
        var stub = sinon.stub(journeySubscriber, "output");
        journeySubscriber.publish({ trackingUnitId: 1, type: "tracking", dateTime: "01/01/01 12:00:00", status: "ign_on" });
        journeySubscriber.publish({ trackingUnitId: 2, type: "tracking", dateTime: "01/01/01 12:01:00", status: "ign_on" });
        journeySubscriber.publish({ trackingUnitId: 1, type: "tracking", dateTime: "01/01/01 12:02:00", status: "ign_off" });
        journeySubscriber.publish({ trackingUnitId: 2, type: "tracking", dateTime: "01/01/01 12:03:00", status: "ign_off" });

        var journey1 = stub.getCall(0).args[0];
        var journey2 = stub.getCall(1).args[0];

        assert(1, journey1.trackingUnitId);
        assert("01/01/01 12:00:00", journey1.startDateTime);
        assert("01/01/01 12:02:00", journey1.endDateTime);

        assert(2, journey2.trackingUnitId);
        assert("01/01/01 12:01:00", journey2.startDateTime);
        assert("01/01/01 12:03:00", journey2.endDateTime);
        journeySubscriber.output.restore();
    });
});


