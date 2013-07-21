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
					highScore = redis.findScore(username, function(score) {
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
					highScore = redis.findScore(username, function(score) {
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
		var scores = {"user1":10, "user2":9, "user3":8, "user4":7, "user5":6, "user6":5};
/*
		// When
		runs(function() {
			flag = false;
			redis.addScore(username, firstScoreToAdd, function() {
				redis.addScore(username, secondScoreToAdd, function() {
					highScore = redis.findScore(username, function(score) {
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
		*/
	});
});
