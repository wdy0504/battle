//var redisClient = require('../../../models/redisClient');
var underscore = require('underscore');
var sprintf = require("sprintf-js").sprintf;
var time1;
module.exports = function (app) {
	app.post('/battle/battle', function (req, res) {
		fightRecord = new FightRecord({});
		time1 = new Date().getTime();
		var b = battle();
		res.send(b);
	});
}
var gBuffOper = [];
//buff列表
var FightStruct = function (opts) {
	this.one = opts.one || {};
	this.two = opts.two || {};
	this.formationId = opts.formationId || 0;
};
var Player = function (opts) {
	this.name = opts.name;
	//类型 1:人物;2:宠物
	this.type = opts.type || 1;
	//战斗位置
	this.pos = opts.pos || 0;
	//战斗血量
	this.hp = opts.hp || 0;
	//战斗状态
	this.battleStatus = opts.battleStatus || 0;
	//最大血量
	this.maxHp = opts.hp || 0;
	//战斗属性
	this.fightAttri = new FightAttri(opts.fightAttri) || {};
	//属性概率
	this.attriRate = new AttriRate(opts.attriRate) || {};
	//技能组
	this.skills = opts.skills || [];
	//技能序号
	this.skillPos = opts.skillPos || 0;
	//宠物
	this.pet = opts.pet || {};
};
//角色属性
var FightAttri = function (opts) {
	//攻击力
	this.attack = opts.attack || 0;
	//护甲
	this.armor = opts.armor || 0;
	//防御
	this.defend = opts.defend || 0;
	//暴击伤害
	this.critHurt = opts.critHurt || 0;
	//暴击
	this.crit = opts.crit || 0;
	//韧性
	this.toughness = opts.toughness || 0;
	//命中
	this.hit = opts.hit || 0;
	//格挡
	this.block = opts.block || 0;
	//破击
	this.wreck = opts.wreck || 0;
	//闪避
	this.avoid = opts.avoid || 0;
	//无视防御
	this.reduceDefend = opts.reduceDefend || 0;
	//无视防御百分比
	this.reduceDefendPer = opts.reduceDefendPer || 0;
	//无视护甲
	this.reduceArmor = opts.reduceArmor || 0;
	//吸血百分比
	this.vampirePer = opts.vampirePer || 0;
	//每回合回血
	this.recoverHp = opts.recoverHp || 0;
	//伤害减免
	this.reduceDamagePer = opts.reduceDamagePer || 0;
};
//角色属性概率
var AttriRate = function (opts) {
	//护甲减伤率
	this.armorRate = opts.armorRate || 0;
	//削弱减伤率
	this.reduceArmorRate = opts.reduceArmorRate || 0;
	//暴击率
	this.critRate = opts.critRate || 0;
	//韧性率
	this.toughnessRate = opts.toughnessRate || 0;
	//命中率
	this.hitRate = opts.hitRate || 0;
	//格挡率
	this.blockRate = opts.blockRate || 0;
	//破击率
	this.wreckRate = opts.wreckRate || 0;
	//闪避率
	this.avoidRate = opts.avoidRate || 0;
};
//角色装备
var Equipment = function (opts) {};
//角色身上的buff
var BuffOper = function (opts) {
	//buff的id
	this.id = opts.id || 0;
	//buff持续回合
	this.tick = opts.tick || 0;
	//buff的值
	this.value = opts.value || 0;
	//buff影响的角色
	this.player = opts.player;
};
var Attacker = function (opts) {
	//位置
	this.pos = opts.pos || 0;
	//释放技能id
	this.skillId = opts.skillId || 0;
	//攻击血量
	this.blood = opts.blood || 0;
	//角色
	this.player = opts.player || {};
};
var Defender = function (opts) {
	//位置
	this.pos = opts.pos || 0;
	//防守方血量
	this.blood = opts.blood || 0;
	//1:格挡;2:闪避;3:反击;4:击飞;5:正常;6:复活;7:double_hit
	this.reacOper1 = opts.reacOper1 || 0;
	//0:暴击;
	this.reacOper2 = opts.reacOper2 || 0;
	//角色
	this.player = opts.player || {};
	//受到的伤害
	this.damage = opts.damage || 0;
};
var FightAction = function (opts) {
	//所属回合
	this.around = opts.around || 0;
	this.attacker = opts.attacker || [];
	this.defenders = opts.defenders || [];
};
var FightRecord = function (opts) {
	//回合总数
	this.roundCount = opts.roundCount || 0;
	//攻击方
	this.attack = opts.attack || 0;
	//防守方
	this.defend = opts.defend || 0;
	//行动细节
	this.fightActions = [];
};
var fightRecord = new FightRecord({});
//技能
var skill = function (opts) {
	//技能id
	this.id = opts.id || 0;
	//技能名称
	this.name = opts.name || 0;
	//技能伤害
	this.damage = opts.damage || 0;
	//技能范围 1单体;2全部
	this.range = opts.range || 1;
	//技能buffId
	this.buffId = opts.buffId || 0;
};
function dead() {};
//计算概率
function calcRate(x) {
	var array1 = [[0, 1, 0], [20, 2, 20], [60, 3, 40], [120, 4, 60], [200, 5, 80], [300, 6, 100], [420, 7, 120], [560, 8, 140], [720, 9, 160], [900, 10, 180], [1100, 11, 200], [1320, 12, 220], [1560, 13, 240]];
	var array2 = [20, 60, 120, 200, 300, 420, 560, 720, 900, 1100, 1320, 1560];
	var index = underscore.sortedIndex(array2, x);
	rate = Math.floor((x - array1[index][0]) / array1[index][1]) + array1[index][2];
	return rate;
};
function calcAllRate(player) {
	player.attriRate.critRate = calcRate(player.fightAttri.crit);
	player.attriRate.toughnessRate = calcRate(player.fightAttri.toughness);
	player.attriRate.hitRate = calcRate(player.fightAttri.hit);
	player.attriRate.blockRate = calcRate(player.fightAttri.block);
	player.attriRate.wreckRate = calcRate(player.fightAttri.wreck);
	player.attriRate.avoidRate = calcRate(player.fightAttri.avoid);
	player.attriRate.armorRate = calcRate(player.fightAttri.armor);
	player.attriRate.reduceArmorRate = calcRate(player.fightAttri.reduceArmor);
};

function battle() {
	var fightAttri = new FightAttri({
			attack : 100,
			armor : 50,
			defend : 50,
			critHurt : 50,
			crit : 150,
			toughness : 50,
			hit : 50,
			block : 150,
			wreck : 50,
			avoid : 150,
			reduceArmor : 0;
		});
	var pet1 = new Player({
			name : '狗',
			type : 2,
			fightAttri : fightAttri,
			hp : 200,
			maxHp : 200;
		});
	calcAllRate(pet1);
	var fightAttri = new FightAttri({
			attack : 100,
			armor : 50,
			defend : 50,
			critHurt : 50,
			crit : 150,
			toughness : 50,
			hit : 50,
			block : 150,
			wreck : 50,
			avoid : 150,
			reduceArmor : 0,
			angry : 0;
		});
	var player1 = new Player({
			name : '韩立',
			type : 1,
			fightAttri : fightAttri,
			hp : 200,
			maxHp : 200,
			pet : pet1,
			skills : [101000,102000,103000,104000]
		});
	calcAllRate(player1);
	
	var fightAttri = new FightAttri({
			attack : 100,
			armor : 50,
			defend : 50,
			critHurt : 50,
			crit : 150,
			toughness : 50,
			hit : 50,
			block : 150,
			wreck : 50,
			avoid : 150,
			reduceArmor : 0,
			angry : 0;
		});
	var pet2 = new Player({
			name : '猫',
			type : 2,
			fightAttri : fightAttri,
			hp : 200,
			maxHp : 200;
		});
	calcAllRate(pet2);
	
	var fightAttri = new FightAttri({
			attack : 100,
			armor : 50,
			defend : 50,
			critHurt : 50,
			crit : 150,
			toughness : 50,
			hit : 50,
			block : 150,
			wreck : 50,
			avoid : 150,
			reduceArmor : 0;
		});
	var player2 = new Player({
			name : '王林',
			type : 1,
			fightAttri : fightAttri,
			hp : 200,
			maxHp : 200,
			pet : pet2,
			skills : [101000,102000,103000,104000]
		});
	calcAllRate(pet2);
	var tmp = {};
	var tmp1 = {};
	var tmp2 = {};
	palyer1.pos = 1;
	pet1.pos = 2;
	palyer2.pos = 11;
	pet2.pos = 12;
	fightRecord.attack.push(palyer1);
	fightRecord.attack.push(pet1);
	fightRecord.defend.push(palyer2);
	fightRecord.defend.push(pet2);
	var fightStructTmp1 = [];
	var fightStructTmp2 = [];
	var pet = new Player(pet1);
	var player = new Player(palyer1);
	player.pet = pet;
	fightStructTmp1.push(player);
	fightStructTmp1.push(pet);
	var pet = new Player(pet2);
	var player = new Player(palyer2);
	player.pet = pet;
	fightStructTmp2.push(player);
	fightStructTmp2.push(pet);
	var around = 0;
	//战斗队列
	attackQueue1 = fightStructTmp1.slice();
	//战斗队列
	attackQueue2 = fightStructTmp2.slice();
	//场上的人
	defendQueue1 = fightStructTmp1.slice();
	//场上的人
	defendQueue2 = fightStructTmp2.slice();
	//循环战斗


	startBattle(attackQueue1, attackQueue2, defendQueue1, defendQueue2, fightRecord) 
	
	return fightRecord;
};