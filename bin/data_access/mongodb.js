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
	
	function insert(doc){
		client.connect(conn_string, function(err, db) {
			if (err) throw err;
			db.collection(collection).insert(JSON.parse(doc), function() {
				db.close();
			});
		});
	};
	
	function findLatest(callback){
		client.connect(conn_string, function(err, db) {
			handleError(err);
			db.collection(collection).find().sort({timestamp: -1}).limit(1).nextObject(function(err, doc) {
				handleError(err);
				db.close();
				if (callback) {
					callback(doc);
				}
			});
		});
	};
	
	var mongodb = {
		insert: insert,
		findLatest: findLatest
	};
	
	return mongodb;
}());