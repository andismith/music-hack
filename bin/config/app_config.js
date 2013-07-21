/*jshint bitwise:false, curly:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, noempty:false, nonew:true, plusplus:false, regexp:false, undef:true, strict:true, trailing:true, expr:true, regexdash:true, browser:true, jquery:true, onevar:true */
/*global require:false, process:false, console:false, __dirname:false, exports:false */
exports.AppConfig = {
    NokiaAPI: {
        app_id: '_WN7DlNjki_uTKc7kY1A'
    },
    Results: {
        count: 3
    },
    Templates: {
        path: __dirname + '/../templates/',
        template: 'template-email.html'
    },
    Express: {
        PORT: 3000
    },
	MongoDB: {
		conn_string: 'mongodb://127.0.0.1:27017/leaderboards',
		collection: 'all'
	},
	Redis: {
		host: '127.0.0.1',
		port: 6379
	}
};