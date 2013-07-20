var mongodb = require('../../bin/data_access/mongodb');
var sortDir = require('../../bin/data_access/sort-direction');

describe("Reading from MongoDB", function(){
	var NAME = "My Name",
		EMAIL = "my@email.com",
		SORT_FIELD = 'timestamp',
		ACCOUNT = {name: NAME, email: EMAIL, SORT_FIELD: new Date()},
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
			mongodb.findLatest(SORT_FIELD, sortDir.DESC, function(doc) {
				name = doc.name;
				email = doc.email;
				console.log(doc[SORT_FIELD]);
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