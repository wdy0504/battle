var Model = require('./model');
var Player = Model.Player;


/**
 * 新建角色并保存
 */
exports.newAndSave = function(p, callback) {
	console.log(p.fightAttri);
	var player = new Player();
	player.userId = p.userId;
	player.name = p.name;
	player.basicAttri = p.basicAttri;
	player.addTime = new Date().getTime();
	player.lvlexp = p.lvlexp;
	player.skills = p.skills || [0,0,0,0];
	player.save(callback);
};

/**
 * 根据查询条件, 查找一个角色
 */
exports.getPlayerByQuery = function(query, callback) {
	Player.findOne(query, callback);
};

/**
 * 根据查询条件, 查找角色
 */
exports.getPlayersByQuery = function(query, callback) {
	Player.find(query, callback);
};

/**
 * 根据查询条件, 删除角色
 */
exports.removePlayerByQuery = function(query, callback) {
	Player.remove(query, callback);
};

/**
 * 根据查询条件, 更新角色
 */
exports.updatePlayerById = function(playerId, field, callback) {
	console.log(field);
	Player.update({
		_id: playerId
	}, field, {}, callback);
};