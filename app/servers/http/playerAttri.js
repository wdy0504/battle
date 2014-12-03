var underscore = require('underscore');


exports.Player = function (opts) {
	this.name = opts.name;
	//类型 1:人物;2:宠物
	this.type = opts.type || 1;
	//战斗位置
	this.pos = opts.pos || 0;
	//战斗血量
	this.hp = opts.hp || 0;
	//战斗状态
	this.battleStatus = opts.battleStatus || 0;
	//状态
	this.status = opts.status || 0; //1:无法回血
	//最大血量
	this.maxHp = opts.hp || 0;
	//战斗属性
	this.fightAttri = new FightAttri(opts.fightAttri) || {};
	//属性概率
	this.attriRate = new AttriRate(opts.attriRate) || {};
	//基础属性
	this.basicAttri = new BasicAttri(opts.basicAttri) || {};
	//技能组
	this.skills = opts.skills || [];
	//技能序号
	this.skillPos = opts.skillPos || 0;
	//宠物
	this.pet = opts.pet || {};
	//身上的buff
	this.buffs = opts.buffs || [];
	//当前经验
	this.exp = opts.exp || 0;
	//当前等级
	this.lvl = opts.lvl || 1;
};
//基础属性
var BasicAttri = function (opts) {
	//属性点
	this.attriPoint = opts.buffs || 0;
	//力量
	this.str = opts.str || 0;
	//体质
	this.con = opts.con || 0;
	//敏捷
	this.dex = opts.dex || 0;
	//意志
	this.wil = opts.wil || 0;
	//精神
	this.spi = opts.spi || 0;
	//血量
	this.maxHp = opts.maxHp || 0;
	//攻击力
	this.attack = opts.attack || 0;
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
	//闪避
	this.avoid = opts.avoid || 0;
	//控制
	this.control = opts.control || 0;
	//抗性
	this.resistance = opts.resistance || 0;
	//无视防御
	this.reduceDefend = opts.reduceDefend || 0;
	//无视防御百分比
	this.reduceDefendPer = opts.reduceDefendPer || 0;
	//吸血百分比
	this.vampirePer = opts.vampirePer || 0;
	//每回合回血
	this.recoverHp = opts.recoverHp || 0;
	//伤害减免
	this.reduceDamagePer = opts.reduceDamagePer || 0;
	//物理伤害减免
	this.reducePhysicalDamagePer = opts.reduceDamagePer || 0;
	//技能伤害减免
	this.reduceSkillDamagePer = opts.reduceDamagePer || 0;
}
//角色属性
var FightAttri = function (opts) {
	//攻击力
	this.attack = opts.attack || 0;
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
	//闪避
	this.avoid = opts.avoid || 0;
	//控制
	this.control = opts.control || 0;
	//抗性
	this.resistance = opts.resistance || 0;
	//无视防御
	this.reduceDefend = opts.reduceDefend || 0;
	//无视防御百分比
	this.reduceDefendPer = opts.reduceDefendPer || 0;
	//吸血百分比
	this.vampirePer = opts.vampirePer || 0;
	//每回合回血
	this.recoverHp = opts.recoverHp || 0;
	//伤害减免
	this.reduceDamagePer = opts.reduceDamagePer || 0;
	//物理伤害减免
	this.reducePhysicalDamagePer = opts.reduceDamagePer || 0;
	//技能伤害减免
	this.reduceSkillDamagePer = opts.reduceDamagePer || 0;
};
//角色属性概率
var AttriRate = function (opts) {
	//削弱减伤率
	this.reduceArmorRate = opts.reduceArmorRate || 0;
	//暴击率
	this.critRate = opts.critRate || 0;
	//韧性率
	this.toughnessRate = opts.toughnessRate || 0;
	//命中率
	this.hitRate = opts.hitRate || 0;
	//闪避率
	this.avoidRate = opts.avoidRate || 0;
};
//计算概率
function calcRate(x) {
	var array1 = [[0, 1, 0], [20, 2, 20], [60, 3, 40], [120, 4, 60], [200, 5, 80], [300, 6, 100], [420, 7, 120], [560, 8, 140], [720, 9, 160], [900, 10, 180], [1100, 11, 200], [1320, 12, 220], [1560, 13, 240]];
	var array2 = [20, 60, 120, 200, 300, 420, 560, 720, 900, 1100, 1320, 1560];
	var index = underscore.sortedIndex(array2, x);
	rate = Math.floor((x - array1[index][0]) / array1[index][1]) + array1[index][2];
	return rate;
};
//升级
exports.lvlup = function (player) {
	player.basicAttri.maxHp += 4;
	player.basicAttri.attack += 2;
	player.basicAttri.hit += 2;
	player.basicAttri.avoid += 2;
	player.basicAttri.defend += 2;
	player.basicAttri.critHurt += 2;
	player.basicAttri.crit += 2;
	player.basicAttri.toughness += 2;
	player.basicAttri.control += 2;
	player.basicAttri.resistance += 2;
	player.basicAttri.attriPoint += 5;
	player.lvl += 1;
};
//计算力量属性
function str(player, num) {
	player.fightAttri.attack += num * 2;
	player.maxHp += num * 1;
}
//计算体质属性
function con(player, num) {
	player.fightAttri.defend += num * 1;
	player.maxHp += num * 3;
}
//计算意志属性
function wil(player, num) {
	player.fightAttri.crit += num * 1;
	player.fightAttri.resistance += 1;
}
//计算敏捷属性
function dex(player, num) {
	player.fightAttri.avoid += num * 2;
	player.fightAttri.crit += num * 1;
}
//计算精神属性
function spi(player, num) {
	player.fightAttri.attack += num * 1;
	player.fightAttri.cure += num * 1;
	player.fightAttri.resistance += num * 1;
	player.fightAttri.control += num * 2;
	player.maxHp += num * 1;
}
//计算基础属性
function calcBasicAttri(player){
	//血量
	player.fightAttri.maxHp += player.basicAttri.maxHp ;
	//攻击力
	player.fightAttri.attack += player.basicAttri.attack ;
	//防御
	player.fightAttri.defend += player.basicAttri.defend ;
	//暴击伤害
	player.fightAttri.critHurt += player.basicAttri.critHurt ;
	//暴击
	player.fightAttri.crit += player.basicAttri.crit ;
	//韧性
	player.fightAttri.toughness += player.basicAttri.toughness ;
	//命中
	player.fightAttri.hit += player.basicAttri.hit;
	//闪避
	player.fightAttri.avoid += player.basicAttri.avoid;
	//控制
	player.fightAttri.control += player.basicAttri.control;
	//抗性
	player.fightAttri.resistance += player.basicAttri.resistance;
}
//计算属性概率
function calcAllRate(player) {
	player.attriRate.critRate = calcRate(player.fightAttri.crit);
	player.attriRate.toughnessRate = calcRate(player.fightAttri.toughness);
	player.attriRate.hitRate = calcRate(player.fightAttri.hit);
	player.attriRate.avoidRate = calcRate(player.fightAttri.avoid);
};
//计算人物属性
exports.calcPlayer = function (player){
	player.fightAttri = new FightAttri({});
	//人物基础属性
	calcBasicAttri(player);
	str(player, player.basicAttri.str);
	con(player, player.basicAttri.con);
	wil(player, player.basicAttri.wil);
	dex(player, player.basicAttri.dex);
	spi(player, player.basicAttri.spi);
	//技能
	//装备
	//属性概率
	calcAllRate(player);
}