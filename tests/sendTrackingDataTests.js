var assert = require('assert'),
    sinon = require('sinon'),
    trackingData = require('../trackingData'),
    sendEvent = require('../sendEvent');


describe('Create Tracking Data', function() {
    it('should return a tracking data packet', function() {
        var packet = trackingData.createPacket();

        assert(packet.id > 0);
        assert(packet.latitude);
        assert(packet.longitude);
        assert(packet.speed >= 0);
    });

    it('should send the packet to be posted', function() {
        var spy = sinon.spy(sendEvent, "send");

        trackingData.sendTrackingDataPacket();
        assert(spy.calledOnce === true);
        sendEvent.send.restore();
    });
});

