var assert = require('assert'),
    sinon = require('sinon'),
    demoData = require('../demoData'),
    sendEvent = require('../sendEvent');


describe('Create Tracking Data', function() {
    it('should return a tracking data packet', function() {
        var packet = demoData.createPacket();

        assert(packet.trackingUnitId > 0);
        assert(packet.latitude);
        assert(packet.longitude);
        assert(packet.speed >= 0);
    });

    it('should send the packet to be posted', function() {
        var spy = sinon.spy(sendEvent, "send");

        demoData.sendTrackingDataPacket();
        assert(spy.calledOnce === true);
        sendEvent.send.restore();
    });
});

