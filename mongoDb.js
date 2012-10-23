var mongo = require('mongodb'),
    mongoServer = mongo.Server,
    mongoDb = mongo.Db;

var dbServer = new mongoServer('localhost', 27017, { auto_reconnect: true });
var currentDb = new mongoDb('tracking', dbServer);
var database;

exports.openDatabase = function (callback) {
    currentDb.open(function (err, db) {
        if(err) {
            console.log(err);
            if (callback) {
                callback(err);
            }
        } else {
            console.log('connected to db');
            database = db;
            if (callback) {
                callback();
            }
        };
    });
};

exports.openDatabase();

var getCollection = function (collectionName, callback) {
    database.collection(collectionName, function(err, collection) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(err, collection);
        };
    });
};

exports.clear = function (collectionName, callback) {
    getCollection(collectionName, function(err, collection) {
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

exports.getAll = function (collectionName, callback) {
    getCollection(collectionName, function(err, collection) {
        collection.find().toArray(function(err, items) {
            if (callback) {
                callback(err, items);
            }
        });
    });
};

exports.insert = function (collectionName, doc, callback) {
    getCollection(collectionName, function(err, collection) {
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
//                    console.log("record inserted into", collectionName);
                    if (callback) {
                        callback(err, result);
                    }
                }
            });
        }
    });
};

exports.clear = function (collectionName, callback) {
    getCollection(collectionName, function(err, collection) {
        collection.remove(function (err, collection) {
            console.log('collection has been cleared');
            if (callback) {
                callback();
            }
        });
    });
};

exports.getAll = function (collectionName, callback) {
    getCollection(collectionName, function(err, collection) {
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




