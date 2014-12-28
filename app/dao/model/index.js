var mongoose = require('mongoose');



mongoose.connect( "mongodb://127.0.0.1/battle", function(err){
	if(err){
		console.error('connect to %s error:', "mongodb://127.0.0.1/battle", err.message);
		process.exit(1);
	}
});

require('./userModel');
require('./playerModel');

exports.User = mongoose.model('User');
exports.Player = mongoose.model('Player');