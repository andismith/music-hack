/*jshint bitwise:false, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:false, nonew:true, plusplus:false, regexp:false, undef:true, strict:true, trailing:true, expr:true, regexdash:true, browser:true, jquery:true, onevar:true */
/*global require:false, process:false, console:false, __dirname:false, exports:false */
(function () {
    "use strict";
    var config = require('../config/app_config'),
        twitter = require('ntwitter');

    exports.TwitterStream = function() {

        function authenticateWithService() {
            var twit = new twitter({
                consumer_key: config.AppConfig.Twitter.consumer_key,
                consumer_secret: config.AppConfig.Twitter.consumer_secret,
                access_token_key: config.AppConfig.Twitter.access_token_key,
                access_token_secret: config.AppConfig.Twitter.access_token_secret
            });

            return twit;
        }
        
        function getHashTagStream(callback) {
            var twitterApi = authenticateWithService(),
                returnedSearch;

            twitterApi.search('#TheOpen', {}, function(err, data) {
              callback(data);
            });          
        }

        return {
            getHashTagStream: getHashTagStream
        };
    };
}());