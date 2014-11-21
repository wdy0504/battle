var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EquipmentsSchema = new Schema({
	playerId: {type: Number},
	firstWeapond: {type: Number, default: 0}, //主武器
	secondWeapond: {type: Number, default: 0}, //副武器
	necklace: {type: Number, default: 0}, //项链
	ring: {type: Number, default: 0}, //戒指
	shoes: {type: Number, default: 0}, //鞋子
	body: {type: Number, default: 0}, //身体
	head: {type: Number, default: 0} //头部
});

