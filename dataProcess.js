var mongoDb = require('./db');
var db;

mongoDb.openDatabase(function (err, database) {
    if(err) {
        console.log("Failed to open database: ", err);
    } else {
        console.log("Database opened");
        db = database;
    };
});

exports.process = function (packet) {
    mongoDb.insert(db, "events", packet, function(err) {
        if (err) {
            console.log("Failed to insert: ", err);
        }
    });
};

