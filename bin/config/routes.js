
/*jshint bitwise:false, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:false, nonew:true, plusplus:false, regexp:false, undef:true, strict:true, trailing:true, expr:true, regexdash:true, browser:true, jquery:true, onevar:true */
/*global require:false, process:false, console:false, __dirname:false, exports:false */
(function () {
    "use strict";
	var nokiaAPI = require('../nokia-api/stream'),
		config = require('../config/app_config'),
		songsSearchResults;

		new nokiaAPI.NokiaMusic().getRandomSong(songsRetrieved);

		function songsRetrieved(songs) {
			songsSearchResults = songs;
		}

		module.exports = function(app) {
			var resultCount;

			app.get('/', function (req, res){ 


				var parsedResults = JSON.parse(songsSearchResults),
					randomId = pickRandomId(parsedResults.tracklist);
					
					resultCount = parsedResults.tracklist.length;
					//randomList(parsedResults.tracklist);

				res.render('index', {'selected': randomId, 'results': randomList(parsedResults.tracklist)});			
			});
            app.get('/web-audio-test', function (req, res){
                res.header('Access-Control-Allow-Origin', '*');
                res.render('web-audio-test', res);           
            });

            function pickRandomId(results) {
            	//console.log(results)
            	var randomNumber = Math.floor((Math.random()*+config.AppConfig.Results.count));

            	return results[randomNumber].id;
	        }

	        function randomList(results) {
	        	var arr = [];
	        		arr.length =0;
				while(arr.length < config.AppConfig.Results.count){
				  var randomnumber=Math.floor(Math.random()+(resultCount-1));
				  var found=false;
				  for(var i=0;i<arr.length;i++){
				    if(arr[i]==randomnumber){found=true;break}
				  }
				  if(!found)arr[arr.length]=results[i].name;
				}
				return arr;

	        }	     		
		};
}());