/*jshint bitwise:false, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:false, nonew:true, plusplus:false, regexp:false, undef:true, strict:true, trailing:true, expr:true, regexdash:true, browser:true, jquery:true, onevar:true */
/*global require:false, process:false, console:false, __dirname:false, exports:false */
(function () {
    "use strict";
    var config = require('../config/app_config'),
        express = require('express'),
        app = express();

    exports.NokiaMusic = function() {       
        
        function getRandomSong(callback) {            
            app.get('http://api.ent.nokia.com/1.x/gb/?products=charts&category=single&domain=music&app_id=_WN7DlNjki_uTKc7kY1A', function(req,res){
                console.log("requesting"+res);
            });
        }

        return {
            getRandomSong: getRandomSong
        };
    };
}());