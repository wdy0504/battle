var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
	userId: {type: ObjectId},
	level: {type: Number}, //等级
	hp: {type: Number, default: 0}, //力量
	mp: {type: Number, default: 0}, //魔法值
	skillPoint: {type: Number, default: 0}, //技能点
	areaId:  {type: Number, default: 0}, //场景
	str: {type: Number, default: 0}, //力量
	dex:  {type: Number, default: 0}, //敏捷
	int:  {type: Number, default: 0}, //智力
	will:  {type: Number, default: 0}, //意志
	luck:  {type: Number, default: 0}, //幸运
	money: {type: Number, default: 0}, //金钱
	gold: {type: Number, default: 0}, //金币
	exp: {type: Number, default: 0}, //当前经验
	bagCount: {type: Number, default: 0} //背包大小
});

