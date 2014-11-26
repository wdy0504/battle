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
	//状态
	this.status = opts.status || 0; //1:无法回血
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
	//身上的buff
	this.buffs = opts.buffs || [];
	//属性点
	this.attriPoint = opts.buffs || 0;
	//当前经验
	this.exp = opts.exp || 0;
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
};
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
	this.control =  opts.control || 0;
	//抗性
	this.resistance =  opts.resistance || 0;
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
function lvlup(p){
	p.maxHp +=3	
	p.fightAttri.attack += 2;
	p.fightAttri.hit += 1;
	p.fightAttri.avoid += 1;
	p.fightAttri.defend += 1;
	p.fightAttri.critHurt += 1;
	p.fightAttri.crit += 1;
	p.fightAttri.toughness += 1;
	p.fightAttri.control += 1;
	p.fightAttri.resistance += 1;
	p.attriPoint += 5;
}

function str(p, num){
	p.fightAttri.attack += num * 2;
	p.maxHp += num * 1;
}

function con(p, num){
	p.fightAttri.defend += num * 2;
	p.maxHp += num * 2;
}

function wil(p, num){
	p.fightAttri.critHurt += num * 1;
	p.fightAttri.crit += num * 3;
	p.fightAttri.resistance += 2;
}

function dex(p, num){
	p.fightAttri.avoid += num * 1;
	p.fightAttri.crit += num * 1;
}

function spi(p, num){
	p.fightAttri.attack += num * 1;
	p.fightAttri.cure += num * 1;
	p.fightAttri.resistance += num * 1;
	p.fightAttri.control += num * 2;
	p.maxHp += num * 1;
}