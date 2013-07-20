window.music = window.music || {};

(function (samplePlayer, undefined) {

  'use strict';

  var SAMPLE_URL = 'http://api.ent.nokia.com/1.x/gb/products/47560659/sample/?domain=music&app_id=_WN7DlNjki_uTKc7kY1A';
//'music/320403433.mp3';

  var sampleBuffer = null,
    context = {};

  function onError(error) {
    console.log(error);
  }

  function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        sampleBuffer = buffer;
        playSound(sampleBuffer);
      }, onError);
    };

    request.send();
  }

  // Play sound
  function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
  }

  // Handle Animation
  function handleAnimation(el, delay) {
    setTimeout(function(){
      $(el).addClass('play');
    }, 20);

    if (delay === true) {
      delay = 50;

      $(el).each(function(){
        delay += 350;
        $(this).css('transition-delay', delay + 'ms');
      });
    }
  }

  // Init any included plugins
  function initPlugins() {
    $('h1').fitText(1.2, { minFontSize: '38px', maxFontSize: '70px' });
  }



  // Init
  function init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    initPlugins();
    handleAnimation('.options li', true);
    //loadSound(SAMPLE_URL);
  }

  samplePlayer.init = init;

}(window.music.samplePlayer = window.music.samplePlayer || {}));

window.music.samplePlayer.init();

(function(question, $) {

  function countdown(i) {
    var $countdown = $('.countdown li'),
      length = $countdown.length;

    if (typeof i === 'undefined') {
      i = 0;
    }
    console.log(i);

    if (i < length) {
      $countdown.removeClass('active');
      $countdown.eq(i).addClass('active');

      setTimeout(function() {
        countdown(++i);
      }, 500);
    }
  }

  function init() {
    countdown();
  }

  question.init = init;

}(window.music.question = window.music.question || {}, jQuery));

(function(music, $) {

  var $body = $('body');

  function init() {
    var pageId = $body.data('page-id');

    if (pageId !== undefined && window.music[pageId]) {
      window.music[pageId].init();
    }

  }

  music.init = init;

})(window.music = window.music || {}, jQuery);
