/*jshint bitwise:false, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:false, nonew:true, plusplus:false, regexp:false, undef:true, strict:true, trailing:true, expr:true, regexdash:true, browser:true, jquery:true, onevar:true */
/*global require:false, process:false, console:false, __dirname:false, exports:false */
(function () {
    'use strict';

    var nokiaAPI = require('../nokia-api/stream'),
        config = require('../config/app_config'),
        songsSearchResults;

    new nokiaAPI.NokiaMusic().getRandomSong(songsRetrieved);

    function songsRetrieved(songs) {
        songsSearchResults = songs;
    }

    module.exports = function(app) {

        var resultCount,
            randomNumber;

        function randomNumber(min, max) {
            return Math.round(Math.random() * (max - min)) + min;
        }

        function initSite(req, res) {
            var pusher = require('../pusher/index.js'),
                auth = {},
                data = {
                    channelId: 'c-' + (req.params.id || randomNumber(10000,99999))
                };

            pusher.initChannel(data.channelId);
                res.render('index', data);
        }

        app.get('/', initSite);

        app.get('/c:id(\\d+)', initSite);

        app.get('/play', function(req, res) {
            var parsedResults = JSON.parse(songsSearchResults);
                resultCount = parsedResults.tracklist.length;
            var randomId = pickRandomId(parsedResults.tracklist);
                    

            res.render('question', {
                'selected': randomId,
                'results': randomList(parsedResults.tracklist)
            });
        });

        app.get('/web-audio-test', function (req, res) {
            res.render('web-audio-test', res);
        });

        app.get('/answer', function (req, res) {
            res.render('answer');
        });

        function pickRandomId(results) {
            var randomNumber = Math.floor((Math.random() * +config.AppConfig.Results.count));

            return results[randomNumber].id;
        }

        function randomList(results) {
            var arr = [],
                randomnumber,
                found;

            arr.length = 0;
            while (arr.length < config.AppConfig.Results.count) {
                randomnumber = Math.floor(Math.random() + (resultCount - 1));
                found = false;

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] === randomnumber) {
                        found = true;
                        break;
                    }
                }

                if (!found) arr[arr.length] = results[i].name;
            }
            return arr;
        }


        function randomiseArray(array) {
            var currentIndex = array.length,
                temporaryValue,
                randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        app.get('/web-audio-test', function (req, res){
            res.render('web-audio-test', res);           
        });

        function pickRandomId(results) {
            randomNumber = Math.floor((Math.random()*resultCount));
            return results[randomNumber].id;
        }

        function randomList(results) {          

            var arr = [],
                pickedSongs = {};
            while(arr.length < config.AppConfig.Results.count){
                var randomnumber=Math.ceil(Math.random()*resultCount)
                  var found=false;
                  for(var i=0;i<arr.length;i++){
                    if(arr[i]==randomnumber){found=true;break}
                  }
                  if(!found){
                    arr[arr.length]={'id': results[randomnumber].id, 'name': results[randomnumber].name};
                    
                  }
            }
            
            arr.push({'id': results[randomNumber].id, 'name': results[randomNumber].name});
            arr = randomiseArray(arr);
            console.log(pickedSongs, arr)
            return arr;
        }       

        function randomiseArray(array){
            var currentIndex = array.length,
                temporaryValue,
                randomIndex;

                // While there remain elements to shuffle...
                while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
                }

                return array;
        }       

    };
}());