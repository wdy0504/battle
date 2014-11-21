var mongoose = require('mongoose');

//var config = require('../../../config/config').config;

mongoose.connect( "mongodb://127.0.0.1/node_dev", function(err){
	if(err){
		console.error('connect to %s error:', "mongodb://127.0.0.1/node_dev", err.message);
		process.exit(1);
	}
});

require('./userModel');

exports.User = mongoose.model('User');