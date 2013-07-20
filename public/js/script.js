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

  // Select an answer
  function selectAnswer() {
    var $item = $('.options').find('a'),
        $selectedPrompt = $('.selected');

    $item.on('click', function(e) {
      e.preventDefault();

      $item.removeClass('active');
      $(this).addClass('active');

      $selectedPrompt.show().find('p').html($(this).text());
    });
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
    selectAnswer();
    //loadSound(SAMPLE_URL);
  }

  samplePlayer.init = init;

}(window.music.samplePlayer = window.music.samplePlayer || {}));

window.music.samplePlayer.init();

(function(animation, $) {

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

  animation.handleAnimation = handleAnimation;

})(window.music.animation = window.music.animation || {}, jQuery);

(function(question, $) {

  var $container = $('.container'),
      $goButton = $('.go'),
      $songSample = $('#song-sample');

  function showQuestion() {
    $container.addClass('ready');
    window.music.animation.handleAnimation('.options li', true);
    $songSample.get(0).play();
  }
  function countdown(i) {
    var $countdown = $('.countdown li'),
      length = $countdown.length;

    if (typeof i === 'undefined') {
      i = 0;
    }

    console.log(i, length);

    if (i < length) {
      $countdown.removeClass('active');
      $countdown.eq(i).addClass('active');

      setTimeout(function() {
        countdown(++i);
      }, 500);
    } else {
      showQuestion();
    }
  }

  function loadAudio() {
    $songSample.get(0).load();
    $songSample.on('loadeddata', function() {
      countdown(0);
    });
  }

  function initEvents() {
    console.log('init events');
    $goButton.on('click', loadAudio);
  }

  function init() {
    initEvents();
  }

  question.init = init;

}(window.music.question = window.music.question || {}, jQuery));

(function(answer, $) {

  function init() {

  }

  answer.init = init;

})(window.music.answer = window.music.answer || {}, jQuery);

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


window.music.init();
