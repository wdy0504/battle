var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PetSchema = new Schema({
	playerId: {type: ObjectId},
	petId: {type: Number, default: 0}, //宠物类型id
	level: {type: Number, default: 0}, //等级
	skill: {type: String, default: 0} //宠物技能列表
});

