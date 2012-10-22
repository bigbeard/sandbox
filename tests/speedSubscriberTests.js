var assert = require('assert'),
speedSubscriber = require('../subscribers/speedSubscriber'),
emitter = require('../emitter');

describe('Speeding.', function() {
    it('Is travelling above 50 so speeding event raised.', function (done) {
        emitter.on('speeding', function (event) {
            assert.equal(event.speed, 60);
            done();
        });
        speedSubscriber.publish({ trackingUnitId: "1", speed: 60, type: "tracking"});
    });
});
