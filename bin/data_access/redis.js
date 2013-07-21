module.exports = (function(){
	var config = require('../config/app_config'),
		redis = require('redis'),
		util = require('./dbutil');

	function addScore(username, score, callback) {
		findScore(username, function(currentScore) {
			if (!currentScore || currentScore < score) {
				var client = redis.createClient(config.AppConfig.Redis.port, config.AppConfig.Redis.host);
				client.ZADD(config.AppConfig.Redis.leaderboard, score, username, function(err) {
					util.handleError(err);
					client.quit();
					util.safeCallback(function() {
						callback();
					});
				});
			}
			else {
				util.safeCallback(function() {
					callback();
				});
			}
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

	function leaderboard(size, callback) {
		var client = redis.createClient(config.AppConfig.Redis.port, config.AppConfig.Redis.host),
		i,
		formatted = [];		
		client.ZREVRANGE(config.AppConfig.Redis.leaderboard, 0, size-1, ['WITHSCORES'], function(err, lb) {
			util.handleError(err);
			client.quit();
			for (var i = 0; i < lb.length; i++) {
				formatted.push({
					name: lb[i],
					score: lb[++i]
				});
			};
			
			util.safeCallback(function() {
				callback(formatted);
			});
		});
	}
	
	return {
		addScore: addScore,
		findScore: findScore,
		leaderboard: leaderboard
	};

}());