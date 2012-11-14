var zmq = require('zeromq'),
    pullSock1 = zmq.socket('pull'),
    pushSock1 = zmq.socket('push');

pullSock1.connect('tcp://127.0.0.1:3000');
console.log('Worker connected to port 3000');

pullSock1.on('message', function(msg){
  console.log('work 1: %s', msg.toString());
});

pushSock1.bindSync('tcp://127.0.0.1:3000');
console.log('Producer bound to port 3000');

setInterval(function(){
  console.log('sending work');
  pushSock1.send('some work');
}, 500);

