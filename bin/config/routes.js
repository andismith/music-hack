/*jshint bitwise:false, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:false, nonew:true, plusplus:false, regexp:false, undef:true, strict:true, trailing:true, expr:true, regexdash:true, browser:true, jquery:true, onevar:true */
/*global require:false, process:false, console:false, __dirname:false, exports:false */
(function () {
    'use strict';

    var nokiaAPI = require('../nokia-api/stream'),
        redis = require('../data_access/redis'),
        config = require('../config/app_config'),
        songsSearchResults,
        selectedTrack,
        response;

    new nokiaAPI.NokiaMusic().getRandomSong(songsRetrieved);

    function songsRetrieved(songs) {
        songsSearchResults = songs;
    }

    module.exports = function(app) {

    	var selectedTrackResult = {},
            answerId;

        app.get('/', function(req, res) {
            res.render('index');
        });

        app.get('/getQuestion', function(req, res) {
            var parsedResults = JSON.parse(songsSearchResults),
                tracks = selectRandomTracks(parsedResults.tracklist),
                selected = getSelectedTrackId(tracks),
                result = {
                    selected: selected,
                    results: tracks
                };
            res.send(result);
        });

        app.get('/getAnswer/:id', function(req, res) {
        	answerId = req.params.id;
            response = res;
        	if(Object.keys(selectedTrackResult).length === 0) {
        		//new nokiaAPI.NokiaMusic().getSongDetails(answerId, correctSongDetails);
        		getSongDetails(answerId);
        	} else {        		
                selectedTrackResult = {}
        	}
        });

        app.get('/web-audio-test', function (req, res) {
            res.render('web-audio-test', res);
        });

        app.get('/answer', function (req, res) {
            res.render('answer');
        });

        app.post('/addScore/:user/:score', function (req, res) {
            if (req.params && req.params.username && req.params.score) {
                redis.addScore(req.params.username, req.params.score);
            } else {
                console.log('Missing value: u:' + req.params.username + ' s:' + req.params.score);
            }
        });

        app.get('/leaderboard', function (req, res) {
            redis.leaderboard(10, function(leaderboard) {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(leaderboard));
				res.end();
			});
        });

        function getSelectedTrackId(tracks) {

            var randomNumber = Math.floor((Math.random() * tracks.length));
            return tracks[randomNumber];
        }

        function pickRandomId(results) {
            var length = results.length;
            var randomNumber = Math.floor((Math.random()*length));
            return results[randomNumber].id;
        }

        function getSongDetails(answerId){
            new nokiaAPI.NokiaMusic().getSongDetails(answerId, correctSongDetails);
        }

        function correctSongDetails(id, track) {
        	if(typeof track === 'undefined') {
        		//new nokiaAPI.NokiaMusic().getSongDetails(id, correctSongDetails);
                getSongDetails(id);
        	} else {
	        	selectedTrack = track;
	        	var parsedResult = JSON.parse(selectedTrack),
	        		result = {
	        			name: parsedResult['name'],
	        			from: getPerformers(parsedResult['creators']['performers']),
	        			image: parsedResult['thumbnails']['100x100']
	        		};
                
                response.send(result);	        	
	        }
        }

        function getPerformers(performers) {
            var performersList = [];
            for (var i = 0; i < performers.length; i++) {
                performersList.push(performers[i].name);
            }

            return String(performersList);
        }

        function selectRandomTracks(tracks) {
            var amount = config.AppConfig.Results.count,
                randomTrackIndex = 0,
                results = [],
                tracksLength = tracks.length;
            while (results.length <= amount) {

                randomTrackIndex = Math.floor(Math.random() * (tracksLength - 1));
                if (!tracks[randomTrackIndex].found) {
                    tracks[randomTrackIndex].found = true;
                    results.push(tracks[randomTrackIndex]);
                }

            }

            return results;
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

    };
}());