var assert = require('assert'),
    sinon = require('sinon'),
    mongoDb = require('../mongoDb');


describe('Open / Clear /Read / Write to Database.', function() {
    var testDb;

    it('Should clear the collection.', function(done) {
        mongoDb.clear("testCollection", function(err) {
            if (err) {
                return done(err)
            }
            done();
        });
    });

    it('Should write the record without error.', function(done) {
        mongoDb.insert("testCollection", { cheese: "edam" }, function(err, result) {
            if (err) {
                return done(err)
            }
            assert(result);
            done();
        });
    });

    it('Should read the record back.', function(done) {
        mongoDb.getAll("testCollection", function(err, items) {
            if (err) {
                return done(err)
            }

            assert(items);
            assert(items.length === 1);
            assert(items[0].cheese === "edam");
            done();
        });
    });
});
