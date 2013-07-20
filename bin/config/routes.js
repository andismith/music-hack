
/*jshint bitwise:false, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:false, nonew:true, plusplus:false, regexp:false, undef:true, strict:true, trailing:true, expr:true, regexdash:true, browser:true, jquery:true, onevar:true */
/*global require:false, process:false, console:false, __dirname:false, exports:false */
(function () {
    "use strict";
	var nokiaAPI = require('../nokia-api/stream'),
		songsSearchResults;

		new nokiaAPI.NokiaMusic().getRandomSong(songsRetrieved);

		console.log("get songs");

		function songsRetrieved(songs) {
			songsSearchResults = songs;
		}

		module.exports = function(app) {
			app.get('/', function (req, res){ 
				res.render('index', songsSearchResults);			
			});
		};
}());