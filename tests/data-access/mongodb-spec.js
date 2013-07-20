var mongodb = require('../../bin/data_access/mongodb');

describe("Reading from MongoDB", function(){
	var NAME = "My Name",
		EMAIL = "my@email.com",
		ACCOUNT = {name: NAME, email: EMAIL, timestamp: new Date()},
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
			mongodb.findLatest(function(doc) {
				name = doc.name;
				email = doc.email;
				console.log(doc.timestamp);
				flag = true;
			});
		});
		
		waitsFor(function(){
			return flag;
		}, 'the correct records should be returned', 50);
		
		// Then
		runs(function() {
			expect(name).toMatch(NAME);
			expect(email).toMatch(EMAIL);
	    });
	});
});