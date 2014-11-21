var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
	playerId: {type: Number},
	kindId: {type: Number, default: 0}, //任务类型id
	taskState: {type: Number, default: 0}, //任务状态
	startTime: {type: Date, default: Date.now} //任务开始时间
	taskData: {type: String, default: 0}, //任务数据
});

