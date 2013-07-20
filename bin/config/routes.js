
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

			app.get('/', function (req, res){ 


				// var parsedResults = JSON.parse(songsSearchResults),
				// 	randomId = pickRandomId(parsedResults.tracklist);
					
				// 	resultCount = parsedResults.tracklist.length;
				// 	//randomList(parsedResults.tracklist);

				res.render('index');			
			});

            app.get('/play', function(req, res) {
            	var parsedResults = JSON.parse(songsSearchResults);
            		resultCount = parsedResults.tracklist.length;
				var	randomId = pickRandomId(parsedResults.tracklist);
					

				res.render('question', {'selected': randomId, 'results': randomList(parsedResults.tracklist, randomId)});	

            });

            app.get('/web-audio-test', function (req, res){
                res.render('web-audio-test', res);           
            });

            function pickRandomId(results) {
            	randomNumber = Math.floor((Math.random()*resultCount));
            	return results[randomNumber].id;
	        }

	        function randomList(results, selected) {
	        	

	        	var arr = [];
				while(arr.length < config.AppConfig.Results.count){
					var randomnumber=Math.ceil(Math.random()*resultCount)
					  var found=false;
					  for(var i=0;i<arr.length;i++){
					    if(arr[i]==randomnumber){found=true;break}
					  }
					  if(!found)arr[arr.length]=[results[randomnumber].id, results[randomnumber].name];
				}
				
				arr.push([results[randomNumber].id, results[randomNumber].name])
				arr = randomiseArray(arr);
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