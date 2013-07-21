(function () {
    'use strict';

    module.exports = function (io) {

      var fs = require('fs'),
        channelId = 0;

      io.configure(function () { 
        io.set("transports", ["xhr-polling"]); 
        io.set("polling duration", 10); 
      });

      // io.sockets.on('connection', function (socket) {
      //   socket.emit('update_position', lastPosition);
      //   socket.on('receive_position', function (data) {
      //      lastPosition = data;
      //      socket.broadcast.emit('update_position', data); // send `data` to all other clients
      //   });
      // });

      var id = 'Hacker'; // whatever default data

      io.sockets.on('connection', function (socket) {

        
        socket.emit('update_position', id);

        socket.on('initChannel', function(id) {
          id = id;
          socket.broadcast.emit('update_position', id); // send `data` to all other clients
        });

      });
    }

}());