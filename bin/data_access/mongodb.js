module.exports = (function(){
	var client = require('mongodb').MongoClient,
		format = require('util').format,
		config = require('../config/app_config'),
		conn_string = config.AppConfig.MongoDB.conn_string,
		collection = config.AppConfig.MongoDB.collection;

	function handleError(err) {
		if (err) {
			throw err;
		}
	}
	
	function safeCallback(callback) {
		if (callback) {
			callback();
		}
		else {
			console.log('No callback function provided.');
		}
	}
	
	function insert(doc){
		client.connect(conn_string, function(err, db) {
			handleError(err);
			db.collection(collection).insert(JSON.parse(doc), function() {
				db.close();
			});
		});
	};
	
	function findLatest(sortField, sortDir, callback){
		client.connect(conn_string, function(err, db) {
			handleError(err);
			db.collection(collection).find().sort([[sortField, sortDir]]).limit(1).nextObject(function(err, doc) {
				handleError(err);
				db.close();
				safeCallback(function() {
					callback(doc);
				});
			});
		});
	};
	
	var mongodb = {
		insert: insert,
		findLatest: findLatest
	};
	
	return mongodb;
}());