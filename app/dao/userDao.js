var Model = require('./model');
var User = Model.User;


/**
 * 新建用户并保存
 * callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} username 用户名
 * @param {String} password 密码
 * @panam {Function} callback 回调函数
 */
exports.newAndSave = function(username, password, callback){
	var user = new User();
	user.username = username
	user.password = password;
	user.save(callback);
};

/**
 * 根据用户名, 查找用户
 * callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} username 用户名
 * @panam {Function} callback 回调函数
 */
exports.getUserByUsername = function(username, callback){
	User.findOne({username: username}, callback);
}

/**
 * 根据查询条件, 查找一个用户
 * callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} query 条件
 * @panam {Function} callback 回调函数
 */
exports.getUserByQuery = function(query, callback){
	User.findOne(query, callback);
}

/**
 * 根据查询条件, 查找用户
 * callback:
 * - err, 数据库异常
 * - users, 用户
 * @param {String} query 条件
 * @panam {Function} callback 回调函数
 */
exports.getUsersByQuery = function(query, callback){
	User.find(query, callback);
}