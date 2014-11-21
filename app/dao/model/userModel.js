var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: {type: String},
	loginServer: {type: Number, default: 1}
});

mongoose.model('User', UserSchema);