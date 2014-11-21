var Model = require('./model');
var Reply = Model.Reply;


/**
 * 回复话题
 * callback:
 * - err, 数据库异常
 * @param {String} content 回复内容
 * @param {String} topicId 话题id
 * @param {String} authorId 回复作者
 * @panam {Function} callback 回调函数
 */
exports.newAndSave = function(content, topicId, authorId, callback){
	var reply = new Reply();
	reply.topicId = topicId;
	reply.content = content;
	reply.authorId = authorId;
	reply.save(callback);
};


/**
 * 获取内容列表
 * callback:
 * - err, 数据库异常
 * - replys, 回复内容
 * @param {String} query 条件
 * @param {String} fields
 * @param {Object} opt 搜索选项
 * @panam {Function} callback 回调函数
 */
exports.getReplysByQuery = function(query, fields, opt, callback){
	Reply.find(query, fields, opt, function(err, docs){
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

