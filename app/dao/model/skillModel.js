var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PetSchema = new Schema({
	playerId: {type: ObjectId},
	level: {type: Number, default: 0}, //技能等级
	skillId: {type: Number, default: 0}, //技能类型id
});

