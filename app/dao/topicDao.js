var Model = require('./model');
var Topic = Model.Topic;


/**
 * 新建话题并保存
 * callback:
 * - err, 数据库异常
 * - topic, 话题
 * @param {String} title 话题题目
 * @panam {Function} callback 回调函数
 */
exports.newAndSave = function(title, callback){
	var topic = new Topic();
	topic.title = title
	topic.save(callback);
};

/**
 * 根据话题题目, 查找话题
 * callback:
 * - err, 数据库异常
 * - topic, 话题
 * @param {String} title 话题题目
 * @panam {Function} callback 回调函数
 */
exports.getTopicByTitle = function(title, callback){
	Topic.findOne({title: title}, callback);
}

/**
 * 根据查询条件, 获取主题列表
 * callback:
 * - err, 数据库异常
 * - topics, 主题列表
 * @param {String} query 条件
 * @param {String} fields
 * @param {Object} opt 搜索选项
 * @panam {Function} callback 回调函数
 */
exports.getTopicsByQuery = function(query, fields, opt, callback){
	Topic.find(query, fields, opt, function(err, docs){
		if (err){
			return callback(err);
		}
		if (docs.length === 0){
			return callback(null, []);
		}
		var array = [];
		for (var i = 0; i < docs.length; i++){
			array.push(docs[i]);
		}
		return callback(null, array);
	});
}