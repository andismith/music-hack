window.music = window.music || {};

(function (samplePlayer, undefined) {

  'use strict';

  var SAMPLE_URL = 'http://api.ent.nokia.com/1.x/gb/products/47560659/sample/?domain=music&app_id=_WN7DlNjki_uTKc7kY1A';

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

  // Start the timer
  function startTimer() {
    var $timer = $('.timer');

    $timer.show();

    setTimeout(function(){
      $timer.addClass('start');
    }, 20);

    setTimeout(function(){
      $timer.find('span').css('background-color', '#F39C12');
    }, 1000);

    setTimeout(function(){
      $timer.find('span').css('background-color', '#E74C3C');
    }, 2000);
  }

  function showQuestion() {
    $container.addClass('ready');
    window.music.animation.handleAnimation('.options li', true);
    $songSample.get(0).play();
    $('.options').find('li').last().on('transitionend', function(){
      startTimer();
    });
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


(function(loading, $) {

  var initComplete = false;

  function countdown(i) {
    var $countdown = $('.countdown li'),
      length = $countdown.length;

    if (typeof i === 'undefined') {
      i = 0;
    }

    console.log(i, length);

    if (i < length) {
      $countdown.removeClass('current');
      $countdown.eq(i).addClass('current');

      setTimeout(function() {
        countdown(++i);
      }, 500);
    } else {
      showQuestion();
      $('.remaining').show();
    }
  }

  function loadAudio() {
    music.$songSample.get(0).load();
    music.$songSample.on('loadeddata', function() {
      countdown(0);
    });
  }

  function getAudioUrl() {
    music.socket.send('getQuestion');
  }

  function activate() {
    if (!initComplete) {
      init();
    }

    getAudioUrl();
  }

  function init() {
    initComplete = true;
  }

  loading.activate = activate;
  loading.init = init;

})(window.music.loading = window.music.loading || {}, jQuery);


/* sockets */
(function(socket, $) {

  var APP_KEY = '725cbee63f04668c5e7f';

  var channel;

  // listen to an event, and run a certain action
  function listen(event, action) {
    console.log('binding ' + event);
    channel.bind(event, function(data) {
      if (action) {
        action(data);
      }
    });
  }

  // send an event to pusher
  function send(event, data) {
    channel.trigger(event, data);
  }

  function init() {
    var pusher = new Pusher(APP_KEY);
    channel = pusher.subscribe(channelId);
    channel.bind('pusher:subscription_succeeded', function() {
      console.log('Connected on ' + channelId);
    });
  }

  socket.send = send;
  socket.listen = listen;
  socket.init = init;

})(window.music.socket = window.music.socket || {}, jQuery);

/* page handler */
(function(pages, $) {

  var $pages = $('.page');

  function activatePage(pageName) {
    if (window.music[pageName] && window.music[pageName].activate) {
      window.music[pageName].activate();
    }
  }

  function navigateTo(pageName) {
    var oldPage = {},
        newPage = {};

    oldPage = $pages.filter('.active');
    newPage = $pages.filter('[data-page-id=' + pageName + ']');
    
    oldPage.removeClass('active');
    newPage.addClass('active');

    activatePage(pageName);
  }

  function initEventHandler() {
    $pages.on('click', '.navigate', function(e) {
      var pageName = e.target.pathname.replace(/\//,'');
      e.preventDefault();
      navigateTo(pageName);
    });
  }

  function init() {
    initEventHandler();
  }

  pages.navigateTo = navigateTo;
  pages.init = init;

})(window.music.pages = window.music.pages || {}, jQuery);

(function(music, $) {

  var $body = $('body'),
      $songSample = $('#song-sample');

  function init() {

    window.music.pages.init();

    $('h1').fitText(1.2, { minFontSize: '38px', maxFontSize: '70px' });

    window.music.socket.init();
    window.music.socket.listen('question', function(data) {
      console.log('hi' + data.message);
    });
  }

  music.$songSample = $songSample;
  music.init = init;

})(window.music = window.music || {}, jQuery);


window.music.init();
