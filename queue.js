var cqs = require("cqs"),
    emitter = new(require('events').EventEmitter);


var cqs = cqs.defaults({ "couch": "http://localhost:5984"
                       , "db"   : "raw_event_queue"
                       });

var event_queue;

var createQueue = function (callback) {
    cqs.CreateQueue("event_queue", function(error, queue) {
        if(!error) {
            console.log("Event queue is ready");
            event_queue = queue;
            if (callback) {
                callback();
            }
        } else {
            console.log("create queue error: ", error);
            if (callback) {
                callback(error);
            }
        }
    });
};

createQueue();

var timer;
var sentCount = 0;
var receiveCount = 0;

var timerEvent = function () {
    getNextMessage(function (messages) {
        if (messages) {
            messages.forEach(function (message) {
                emitter.emit("receive", message.Body);
                message.del(function (error) {
//                    console.log("message deleted");
                    receiveCount++;
                    if (receiveCount%100 === 0 ) {
                        console.log("Messages received : ", receiveCount);
                    }
                });
            });
        }
    });
};

var getNextMessage = function (callback) {
    cqs.ReceiveMessage(event_queue, 10, function (error, messages) {
        if (error) {
            console.log("receive error: ", error);
        }
        if (messages) {
            callback(messages);
        }
    });
};

var eventQueue = {
    send: function (payload, callback) {
        event_queue.send(payload, function(error, message) {
            if(error) {
                console.log("send error: ", error);
                callback(error);
            } else {
                sentCount++;
                if (sentCount%100 === 0 ) {
                    console.log("Messages sent to queue : ", sentCount);
                }
                callback();
            }
        });
    },
    on: function (eventType, callback) {
        emitter.on(eventType, callback);
    },
    startReceive : function () {
        createQueue(function (error) {
            if (!error) {
                timer = setInterval(timerEvent, 100);
            };
        });
    }
};

module.exports = eventQueue;
