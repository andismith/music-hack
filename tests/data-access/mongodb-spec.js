var mongodb = require('../../bin/data_access/mongodb');

describe("Reading from MongoDB", function(){
	var NAME = "My Name",
		EMAIL = "my@email.com",
		ACCOUNT = {name: NAME, email: EMAIL, date: new Date()},
		value,
		flag;
		
	beforeEach(function(){
		var testRecord = JSON.stringify(ACCOUNT);
		mongodb.insert(testRecord);
	});

	it("should read database", function() {
		// Given
		var name, 
			email;

		// When
		runs(function() {
			flag = false;
			mongodb.find("email", EMAIL, function(results) {
				var result = results[0];
				name = result.name;
				email = result.email;
				flag = true;
			});
		});
		
		waitsFor(function(){
			return flag;
		}, 'the correct records should be returned', 200);
		
		// Then
		runs(function() {
			expect(name).toMatch(NAME);
			expect(email).toMatch(EMAIL);
	    });
	});
});