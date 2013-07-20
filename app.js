(function () {
    "use strict";
    var express = require('express'),
        path = require('path'),
        http = require('http'),
        app = express(),
        handlebarsLayout = require('handlebars'),
        engines = require('consolidate'),

        // Global Application settings
        AppConfig = require('./bin/config/app_config');
		require('./bin/config/routes.js')(app);
		configureExpress();

	function configureExpress() {
		console.log("configuring express", __dirname);
		app.configure(function () {
			app.set('views', __dirname+ '/views');
			app.set('port', AppConfig.AppConfig.Express.PORT);

			app.set('view engine', 'html');
			app.set("view options", { layout: true });
			app.engine('.html', engines.handlebars);
			app.use(express.static(path.join(__dirname, '/public')));
			app.use(app.router);
		});

		http.createServer(app).listen(app.get('port'), function () {
			console.log("Express server listening on port " + app.get('port'));
		});
	}
}());