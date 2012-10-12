var mongo = require('mongodb'),
    mongoServer = mongo.Server,
    database = mongo.Db;

var dbServer = new mongoServer('localhost', 27017, { auto_reconnect: true });
var currentDb = new database('tracking', dbServer);

exports.openDatabase = function (callback) {
    currentDb.open(function (err, db) {
        if(err) {
            console.log(err);
            callback(err);
        } else {
            console.log('connected to db');
            callback(err, db);
        };
    });
};

var getCollection = function (db, collectionName, callback) {
    db.collection(collectionName, function(err, collection) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(err, collection);
        };
    });
};

exports.clear = function (db, collectionName, callback) {
    getCollection(db, collectionName, function(err, collection) {
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
};

exports.getAll = function (db, collectionName, callback) {
    getCollection(db, collectionName, function(err, collection) {
        collection.find().toArray(function(err, items) {
            if (callback) {
                callback(err, items);
            }
        });
    });
};

exports.insert = function (db, collectionName, doc, callback) {
    getCollection(db, collectionName, function(err, collection) {
        if (err) {
            if (callback) {
                callback(err);
            }
        } else {
            collection.insert(doc, {safe: true}, function(err, result) {
                if (err) {
                    console.log(err);
                    if (callback) {
                        callback(err);
                    }
                } else {
                    console.log("record inserted into", collectionName);
                    if (callback) {
                        callback(err, result);
                    }
                }
            });
        }
    });
};

exports.clear = function (db, collectionName, callback) {
    getCollection(db, collectionName, function(err, collection) {
        collection.remove(function (err, collection) {
            console.log('collection has been cleared');
            if (callback) {
                callback();
            }
        });
    });
};

exports.getAll = function (db, collectionName, callback) {
    getCollection(db, collectionName, function(err, collection) {
        collection.find().toArray(function(err, items) {
            if (err) {
                console.log(err);
                if (callback) {
                    callback(err);
                }
            } else {
                if (callback) {
                    callback(err, items);
                }
            }
        });
    });
};




