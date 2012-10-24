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
            callback();
        } else {
            console.log("create queue error: ", error);
            callback(error);
        }
    });
};

var timer;

var timerEvent = function () {
    getNextMessage(function (message) {
        if (message) {
            emitter.emit("receive", message.Body);
            message.del(function (error) {
                console.log("message deleted");
            });
        }
    });
};

var getNextMessage = function (callback) {
    event_queue.receive(function (error, messages) {
        if (error) {
            console.log("receive error: ", error);
        }
        if (messages) {
            callback(messages[0]);
        }
    });
};

var eventQueue = {
    send: function (payload) {
        event_queue.send(payload, function(error, message) {
            if(error) {
                console.log("send error: ", error);
            } else {
                console.log('Sent: ' + JSON.stringify(message.Body));
            }
        });
    },
    on: function (eventType, callback) {
        emitter.on(eventType, callback);
    },
    startReceive : function () {
        createQueue(function (error) {
            if (!error) {
                timer = setInterval(timerEvent, 10);
            };
        });
    }
};

module.exports = eventQueue;
