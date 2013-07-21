module.exports = (function(){
	var config = require('../config/app_config'),
		redis = require('redis'),
		util = require('./dbutil');

	function addScore(username, score, callback) {
		var client = redis.createClient(config.AppConfig.Redis.port, config.AppConfig.Redis.host);
		client.ZADD(config.AppConfig.Redis.leaderboard, score, username, function(err) {
			util.handleError(err);
			client.quit();
			util.safeCallback(function() {
				callback();
			});
		});
	}
	
	function findScore(username, callback) {
		var client = redis.createClient(config.AppConfig.Redis.port, config.AppConfig.Redis.host);
		client.ZSCORE(config.AppConfig.Redis.leaderboard, username, function(err, score) {
			util.handleError(err);
			client.quit();
			util.safeCallback(function() {
				callback(score);
			});
		});
	}
	
	return {
		addScore: addScore,
		findScore: findScore
	};

}());