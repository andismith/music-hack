var redis = require('../../bin/data_access/redis');

describe("Writing to Redis", function(){

	it("should add a score for a new user", function() {
		// Given
		var now = new Date(),
			username = "un_"+now,
			scoreToAdd = 123456,
			highScore,
			leaderboard;

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
		}, 'the correct records should be returned', 50);
		
		// Then
		runs(function() {
			expect(highScore).toMatch(scoreToAdd);
	    });
	});

	it("should change score for existing user if new score is higher", function() {
		// Given
		var now = new Date(),
			username = "un_"+now,
			firstScoreToAdd = 123456,
			secondScoreToAdd = 123457,
			highScore;

		// When
		runs(function() {
			flag = false;
			redis.addScore(username, firstScoreToAdd, function() {
				redis.addScore(username, secondScoreToAdd, function() {
					redis.findScore(username, function(score) {
						highScore = score;
						flag = true;
					});
				});
			});
		});

		waitsFor(function(){
			return flag;
		}, 'the correct records should be returned', 50);

		// Then
		runs(function() {
			expect(highScore).toMatch(secondScoreToAdd);
	    });
	});

	it("should not change score for existing user if new score is lower", function() {
		// Given
		var now = new Date(),
			username = "un_"+now,
			firstScoreToAdd = 123459,
			secondScoreToAdd = 123458,
			highScore;

		// When
		runs(function() {
			flag = false;
			redis.addScore(username, firstScoreToAdd, function() {
				redis.addScore(username, secondScoreToAdd, function() {
					redis.findScore(username, function(score) {
						highScore = score;
						flag = true;
					});
				});
			});
		});

		waitsFor(function(){
			return flag;
		}, 'the correct records should be returned', 50);

		// Then
		runs(function() {
			expect(highScore).toMatch(firstScoreToAdd);
	    });
	});

	it("should return top x records in leaderboard", function() {
		// Given

		// When
		runs(function() {
			flag = false;
			redis.addScore("user1", 9999999, function() {
				redis.addScore("user2", 9999998, function() {
					redis.addScore("user3", 9999997, function() {
						redis.addScore("user4", 9999996, function() {
							redis.leaderboard(3, function(lb) {
								leaderboard = lb;
								flag = true;
							});
						});
					});
				});
			});
		});

		waitsFor(function(){
			return flag;
		}, 'the correct records should be returned', 50);

		// Then
		runs(function() {
			expect(leaderboard.length).toMatch(3);
			expect(leaderboard[0].name).toMatch("user1");
			expect(leaderboard[0].score).toMatch(9999999);
			expect(leaderboard[1].name).toMatch("user2");
			expect(leaderboard[1].score).toMatch(9999998);
			expect(leaderboard[2].name).toMatch("user3");
			expect(leaderboard[2].score).toMatch(9999997);
	    });
	});
});
