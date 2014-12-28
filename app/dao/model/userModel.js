var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
     _id: {type: String},
    username: {type: String},
    password: {type: String},
    loginTime: {type: Number}
});

mongoose.model('User', UserSchema);