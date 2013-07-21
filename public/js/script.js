window.music = window.music || {};

(function(score) {

  var hiScore = 0,
      totalScore = 0,
      $score = $('.score-board .score'),
      $hiScore = $('.score-board .hi-score');

  function getTotal() {
    return totalScore;
  }

  function getHiScore() {
    if (totalScore > hiScore) {
      hiScore = totalScore;
    }
    return hiScore;
  }

  function addToTotal(value) {
    totalScore += parseInt(value, 10);
  }

  function setTotal(value) {
    totalScore = parseInt(value, 10);
  }

  function updateScoreBar() {
    $score.text(getTotal());
    $hiScore.text(getHiScore());
  }

  score.updateScoreBar = updateScoreBar;
  score.getTotal = getTotal;
  score.addToTotal = addToTotal;
  score.setTotal = setTotal;

}(window.music.score = window.music.score || {}));

(function(rounds) {

  var TOTAL_ROUNDS = 5;

  var currentRound = 1,
      $round = $('.score-board .round'),
      $totalRounds = $('.score-board .total-rounds');

  function getRound() {
    return currentRound;
  }

  function getTotalRound() {
    return TOTAL_ROUNDS;
  }

  function incrementRound() {
    currentRound++;
    return (currentRound < TOTAL_ROUNDS);
  }

  function setRound(value) {
    currentRound = parseInt(value, 10);
  }

  function updateRound() {
    $round.text(getRound());
    $totalRounds.text(getTotalRound());
  }

  rounds.updateRound = updateRound;
  rounds.getRound = getRound;
  rounds.incrementRound = incrementRound;
  rounds.setRound = setRound;

}(window.music.rounds = window.music.rounds || {}));

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
  var QUESTION_LENGTH = 10000;

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
    }, QUESTION_LENGTH/10);

    setTimeout(function(){
      $timer.find('span').css('background-color', '#E74C3C');
    }, QUESTION_LENGTH/5);

    setTimeout(function() {
      $timer.removeClass('start').find('span').css('background-color','');
      $timer.parent('.remaining').hide();
      endQuestion();
    }, QUESTION_LENGTH);
  }

  function endQuestion() {
    var $selected = $('.answer-options').find('.selected');

    $songSample.get(0).pause();

    if ($selected.length === 0) {

      window.music.pages.navigateTo('answerWrong');

    } else if (window.music.checkAnswerCorrect($selected.data('music-id'))) {

      window.music.score.addToTotal(10);
      window.music.pages.navigateTo('answerCorrect');
    } else {
      window.music.score.addToTotal(-5);
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

    setTimeout(function() {
      window.music.rounds.incrementRound();
      window.music.pages.navigateTo('loading');
    }, 4000);
  }

  function init() {
    initComplete = true;

  }

  answer.activate = activate;
  answer.init = init;

})(window.music.answer = window.music.answer || {}, jQuery);

window.music.answerCorrect = window.music.answer;
window.music.answerWrong = window.music.answer;

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
      $countdown.removeClass('current');
      $countdown.eq(0).addClass('current');
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
    music.$songSample.prop('src', AUDIO_URL_PREFIX + data.selected.id + AUDIO_URL_SUFFIX);
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

(function(index, $) {

  var initComplete = false,
      $name = $('#name');

  function loadName() {
    if (Modernizr.localstorage) {
      return localStorage['name'];
    }
  }

  function saveName(name) {
    if (Modernizr.localstorage) {
      localStorage['name'] = name;
    }
  }

  function activate() {
    if (!initComplete) {
      init();
    }

    window.music.score.setTotal(0);
    $name.val(loadName());
  }

  function initEventHandlers() {
    var $form = $('.user-form');

    $name.on('keyup', function(e) {
      if (e.target.value.length > 0) {
        $(e.target).removeClass('error');
      }
    });

    $form.on('submit', function(e) {
      $form.find('.navigate').trigger('click');
      return false;
    });

    $form.on('click', '.navigate', function(e) {
      e.preventDefault();
      if ($name.get(0).checkValidity()) {
        saveName($name.val());
      } else {
        e.stopPropagation();
        $name.addClass('error');
      }
    });
  }

  function init() {
    initComplete = true;
    initEventHandlers();
  }

  index.activate = activate;
  index.init = init;

})(window.music.index = window.music.index || {}, jQuery);

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

    window.music.score.updateScoreBar();
    window.music.rounds.updateRound();

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

  function storeAnswer(data) {
    console.log(data);
    answer = data;
  }

  function getAnswer() {
    return data;
  }

  function checkAnswerCorrect(id) {
    return (parseInt(id, 10) === parseInt(answer.id, 10));
  }

  function init() {

    window.music.pages.init();
    window.music.index.activate();

    $('h1').fitText(1.2, { minFontSize: '38px', maxFontSize: '70px' });
  }

  music.$songSample = $songSample;
  music.storeAnswer = storeAnswer;
  music.checkAnswerCorrect = checkAnswerCorrect;
  music.init = init;

})(window.music = window.music || {}, jQuery);


window.music.init();
