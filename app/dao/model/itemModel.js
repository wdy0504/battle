var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
	playerId:  {type: ObjectId},
	type: {type: Number, default: 0}, //物品类型
	proirtety: {type: String, default: 0}, //物品属性或用途
	count: {type: Number, default: 0} //物品数量
});

