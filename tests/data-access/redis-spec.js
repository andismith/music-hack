var redis = require('../../bin/data_access/redis');

describe("Writing to Redis", function(){

	it("should add a score for a new user", function() {
		// Given
		var now = new Date(),
			username = "un_"+now,
			scoreToAdd = 123456,
			highScore;

		// When
		runs(function() {
			flag = false;
			redis.addScore(username, scoreToAdd, function() {
				highScore = redis.findScore(username, function(score) {
					highScore = score;
					flag = true;
				});
			});
		});
		
		waitsFor(function(){
			return flag;
		}, 'the correct records should be returned', 5000);
		
		// Then
		runs(function() {
			expect(highScore).toMatch(scoreToAdd);
	    });
	});
});
