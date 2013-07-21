module.exports = (function(){
	var client = require('mongodb').MongoClient,
		format = require('util').format,
		util = require('./dbutil'),
		config = require('../config/app_config'),
		conn_string = config.AppConfig.MongoDB.conn_string,
		collection = config.AppConfig.MongoDB.collection,
		mongodb;

	function insert(doc){
		client.connect(conn_string, function(err, db) {
			util.handleError(err);
			db.collection(collection).insert(JSON.parse(doc), function() {
				db.close();
			});
		});
	};
	
	function findLatest(sortField, sortDir, callback){
		client.connect(conn_string, function(err, db) {
			util.handleError(err);
			db.collection(collection).find().sort([[sortField, sortDir]]).limit(1).nextObject(function(err, doc) {
				util.handleError(err);
				db.close();
				util.safeCallback(function() {
					callback(doc);
				});
			});
		});
	};
	
	return {
		insert: insert,
		findLatest: findLatest
	};
}());