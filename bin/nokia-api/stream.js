/*jshint bitwise:false, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:false, nonew:true, plusplus:false, regexp:false, undef:true, strict:true, trailing:true, expr:true, regexdash:true, browser:true, jquery:true, onevar:true */
/*global require:false, process:false, console:false, __dirname:false, exports:false */
(function () {
    "use strict";
    var config = require('../config/app_config'),
        request = require('request');

    exports.NokiaMusic = function() {       

        function getRandomSong(callback) { 
            request('http://api.ent.nokia.com/1.x/gb/mixes/groups/44630457/?domain=music&app_id=_WN7DlNjki_uTKc7kY1A', function (error, response, body) {
                //var parsedJSON = JSON.parse(body).items;

                callback(body);
            });
        }

        return {
            getRandomSong: getRandomSong
        };
    };
}());