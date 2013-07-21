module.exports = (function(){
	var config = require('../config/app_config'),
		redis = require('redis'),
		client = redis.createClient(config.AppConfig.Redis.port, config.AppConfig.Redis.host);

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.quit();
	
	return {
		
	};

}());