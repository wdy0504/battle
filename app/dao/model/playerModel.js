var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var PlayerSchema = new Schema({
	userId: {type: ObjectId},
	name:  {type: String},
	lvl: {type: Number, default: 1}, //等级
	type:  {type: Number, default: 1}, //角色类型，1人物，2宠物
	skills: [], //技能
	basicAttri :{},
	petId : {type: ObjectId},
	areaId:  {type: Number, default: 0}, //场景
	money: {type: Number, default: 0}, //金钱
	gold: {type: Number, default: 0}, //金币
	exp: {type: Number, default: 0}, //当前经验
	bagCount: {type: Number, default: 40},//背包大小
	bags:[],//背包
	addTime: {type: Number},
	lvlexp: {type: Number, default: 0},
	mapId: {type: Number, default: 0}
});

mongoose.model('Player', PlayerSchema);
