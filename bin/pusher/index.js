module.exports = (function () {
  "use strict";

  var config = require('../config/app_config'),
      Pusher = require('pusher'),
      channelId = 0;

  var pusher = new Pusher({
    appId: config.AppConfig.Pusher.appId,
    key: config.AppConfig.Pusher.key,
    secret: config.AppConfig.Pusher.secret
  });

  function initChannel(id) {
    console.log(id + ' init channel');
    channelId = id;
  }

  function sendQuestion() {
    console.log(channelId + ' sending question');
    pusher.trigger(channelId, 'question', {"message": "hello world"});

  }

  return {
    sendQuestion: sendQuestion,
    initChannel: initChannel
  };

})();