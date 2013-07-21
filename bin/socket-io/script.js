module.exports = (function () {
  "use strict";

  var io = require('socket.io').listen(8080),
    fs = require('fs'),
    channelId = 0;

  io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
  });

  io.sockets.on('connection', function (socket) {

    socket.on('initChannel', function(id) {
      console.log(id + 'init channel');
      channelId = id;
    });

  });

})();