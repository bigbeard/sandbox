var mongo = require('mongodb'),
    mongoServer = mongo.Server,
    mongoDb = mongo.Db;

var dbServer1 = new mongoServer('localhost', 27017, { auto_reconnect: true });
var dbServer2 = new mongoServer('localhost', 28000, { auto_reconnect: true });
var currentDb1 = new mongoDb('tracking', dbServer1);
var currentDb2 = new mongoDb('tracking', dbServer2);
var database1;
var database2;


var getCollection = function (collectionName, dbNumber, callback) {
    if (dbNumber === 1) {
        database1.collection(collectionName, function(err, collection) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(err, collection);
            };
        });
    } else {
        database2.collection(collectionName, function(err, collection) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(err, collection);
            };
        });
    }
};

var mongoDatabase = {
    openDatabase: function (currentDb, callback) {
        currentDb.open(function (err, db) {
            if(err) {
                console.log(err);
                if (callback) {
                    callback(err);
                }
            } else {
                console.log('connected to db');
                if (callback) {
                    callback(db);
                }
            };
        });
    },
    clear: function (collectionName, callback) {
        getCollection(collectionName, 1, function(err, collection) {
            collection.remove(function (err, collection) {
                if (err) {
                    console.log(err);
                    if (callback) {
                        callback(err);
                    }
                } else {
                    console.log('collection has been cleared');
                    if (callback) {
                        callback();
                    }
                }
            });
        });
    },
    getAll: function (collectionName, callback) {
        getCollection(collectionName, 1, function(err, collection) {
            collection.find().toArray(function(err, items) {
                if (callback) {
                    callback(err, items);
                }
            });
        });
    },
    insert: function (collectionName, dbNumber, doc, callback) {
        getCollection(collectionName, dbNumber, function(err, collection) {
            if (err) {
                if (callback) {
                    callback(err);
                }
            } else {
                collection.insert(doc, {safe: true}, function(err, result) {
                    if (err) {
                        console.log(err, dbNumber);
                        if (callback) {
                            callback(err);
                        }
                    } else {
                        if (callback) {
                            callback(err, result);
                        }
                    }
                });
            }
        });
    }
};

mongoDatabase.openDatabase(currentDb1, function(db) {
    database1 = db;
});

mongoDatabase.openDatabase(currentDb2, function (db) {
    database2 = db;
});


module.exports = mongoDatabase;


