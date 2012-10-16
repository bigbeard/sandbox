var assert = require('assert'),
    sinon = require('sinon'),
    demoData = require('../demoData'),
    sendEvent = require('../sendEvent');


describe('Create Tracking Data.', function() {
    it('Should return a tracking data packet.', function() {
        var packet = demoData.createPacket();

        assert(packet.trackingUnitId > 0);
        assert(packet.latitude);
        assert(packet.longitude);
        assert(packet.speed >= 0);
    });

    it('Should send the packet to be posted.', function() {
        var stub = sinon.stub(sendEvent, "send");

        demoData.sendTrackingDataPacket();
        assert(stub.calledOnce === true);
        sendEvent.send.restore();
    });
});

