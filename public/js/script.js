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

  

  // Init any included plugins
  function initPlugins() {
    $('h1').fitText(1.2, { minFontSize: '38px', maxFontSize: '70px' });
  }

  // Init
  function init() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    initPlugins();
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
  var initComplete = false,
      $container = $('.container'),
      $goButton = $('.go'),
      $songSample = $('#song-sample');

  // Start the timer
  function startTimer() {
    var $timer = $('.timer');

    $timer.parent('.remaining').show();

    setTimeout(function(){
      $timer.addClass('start');
    }, 20);

    setTimeout(function(){
      $timer.find('span').css('background-color', '#F39C12');
    }, 1000);

    setTimeout(function(){
      $timer.find('span').css('background-color', '#E74C3C');
    }, 2000);

    setTimeout(endQuestion, 10000);
  }

  function endQuestion() {
    var $selected = $('.answer-options').find('.selected');

    if ($selected.length > 0 && window.music.checkAnswerCorrect($selected.data('music-id'))) {
      window.music.pages.navigateTo('answerCorrect');
    } else {
      window.music.pages.navigateTo('answerWrong');
    }
  }

  function showQuestion() {
    window.music.animation.handleAnimation('.answer-options li', true);
    $songSample.get(0).play();
    $('.answer-options').find('li').last().on('transitionend', function(){
      startTimer();
    });
  }

  // Select an answer
  function selectAnswer(e) {
      e.preventDefault();
      $('.answer-options').find('a').removeClass('selected');
      $(e.target).addClass('selected');
  }

  function activate() {
    if (!initComplete) {
      init();
    }

    showQuestion();

  }

  function initEventHandlers() {
    var $answers = $('.answer-options');

    $answers.on('click', 'a', selectAnswer);
  }

  function init() {
    initComplete = true;
    initEventHandlers();
  }

  question.activate = activate;
  question.init = init;

}(window.music.question = window.music.question || {}, jQuery));

(function(answer, $) {

  var initComplete = false;

  function activate() {
    if (!initComplete) {
      init();
    }
  }

  function init() {
    initComplete = true;

  }

  answer.activate = activate;
  answer.init = init;

})(window.music.answer = window.music.answer || {}, jQuery);


(function(loading, $) {

  var AUDIO_URL_PREFIX = 'http://api.ent.nokia.com/1.x/gb/products/',
      AUDIO_URL_SUFFIX = '/sample/?domain=music&app_id=_WN7DlNjki_uTKc7kY1A';

  var initComplete = false;

  function countdown(i) {
    var $countdown = $('.countdown li'),
      length = $countdown.length;

    if (typeof i === 'undefined') {
      i = 0;
    }

    if (i < length) {
      $countdown.removeClass('current');
      $countdown.eq(i).addClass('current');

      setTimeout(function() {
        countdown(++i);
      }, 500);
    } else {
      window.music.pages.navigateTo('question');
    }
  }

  function populateAnswers(data) {

    var i = 0,
        length = data.results.length,
        html = '',
        $answers = $('.answer-options');

    for (i=0; i<length; i++) {
      html += '<li><a href="#" data-icon="check" data-music-id="' + data.results[i].id + '">' + data.results[i].name + '</a></li>';
    }

    $answers.html(html);
  }

  function loadAudio(data) {
    music.$songSample.prop('src', AUDIO_URL_PREFIX + data.selected + AUDIO_URL_SUFFIX);
    music.$songSample.get(0).load();
    music.$songSample.one('loadeddata', function() {
      countdown(0);
    });
  }

  function loadQuestion() {
    $.ajax('/getQuestion')
    .done(function(data) {
      loadAudio(data);
      populateAnswers(data);
      window.music.storeAnswer(data.selected);
    });
  }

  function activate() {
    if (!initComplete) {
      init();
    }

    loadQuestion();
  }

  function init() {
    initComplete = true;
  }

  loading.activate = activate;
  loading.init = init;

})(window.music.loading = window.music.loading || {}, jQuery);

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

  var answer = 0,
      $body = $('body'),
      $songSample = $('#song-sample');

  function storeAnswer(id) {
    answer = parseInt(id, 10);
  }

  function checkAnswerCorrect(id) {
    console.log(id, answer);
    return (parseInt(id, 10) === answer);
  }

  function init() {

    window.music.pages.init();

    $('h1').fitText(1.2, { minFontSize: '38px', maxFontSize: '70px' });
  }

  music.$songSample = $songSample;
  music.storeAnswer = storeAnswer;
  music.checkAnswerCorrect = checkAnswerCorrect;
  music.init = init;

})(window.music = window.music || {}, jQuery);


window.music.init();
