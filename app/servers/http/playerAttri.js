var underscore = require('underscore');
var utils = require("../../util/util");

var playerAttri = module.exports;

playerAttri.Player = function(opts) {
    this.id = opts.id || 0;
    //模型id
    this.userId = opts.userId || 0;
    //角色名字
    this.name = opts.name;
    //类型 1:人物;2:宠物,3：怪物
    this.type = opts.type || 1;
    //战斗属性
    this.fightAttri = opts.fightAttri ? new FightAttri(opts.fightAttri) : new FightAttri({});
    //属性概率
    // this.attriRate = opts.attriRate ? new AttriRate(opts.attriRate) : new AttriRate({});
    // 装备
    this.equipments = this.equipments || {};
    //基础属性
    this.basicAttri = new BasicAttri(opts.basicAttri);
    //技能组
    this.skills = opts.skills || [];
    //宠物
    this.pet = opts.pet || {};
    //当前经验
    this.exp = opts.exp || 0;
    //当前等级
    this.lvl = opts.lvl || 1;
    //获得经验
    this.getexp = opts.getexp || 0;
    //升级所需经验
    this.lvlexp = opts.lvlexp || 0;
    //角色所在的地图
    this.mapId = opts.mapId || 0;
    //角色背包id
    this.bagId = opts.bagId || 'U' + utils.uuid(10);
    //角色背包大小
    this.bagSize = opts.bagSize || 40;
};

playerAttri.Monster = function(opts) {
    //模型id
    this.id = opts.id || 0;
    //角色名字
    this.name = opts.name;
    //类型 1:人物;2:宠物,3：怪物,4: boss
    this.type = opts.type || 3;
    //战斗属性
    this.fightAttri = opts.fightAttri ? new FightAttri(opts.fightAttri) : new FightAttri({});
    //基础属性
    this.basicAttri = new BasicAttri(opts.basicAttri);
    //技能组
    this.skills = opts.skills || [];
    //当前等级
    this.lvl = opts.lvl || 1;
    //获得经验
    this.getexp = opts.getexp || 0;
};

//基础属性
playerAttri.BasicAttri = BasicAttri;

function BasicAttri(opts) {
    //属性点
    this.attriPoint = opts.attriPoint || 0;
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
playerAttri.FightAttri = FightAttri;

function FightAttri(opts) {
    //血量
    this.hp = opts.hp || 0;
    //最大血量
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
    //治疗
    this.cure = opts.cure || 0;
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
    //战斗状态
    this.battleStatus = opts.battleStatus || 0;
    //状态
    this.status = opts.status || 0; //1:无法回血
    //技能序号
    this.skillPos = opts.skillPos || 0;
    //战斗位置
    this.pos = opts.pos || 0;
    //技能
    this.skills = opts.skills || 0;
    //角色名子
    this.name = opts.name || '';
    //类型 1:人物;2:宠物：3：怪物
    this.type = opts.type || 1;
    //暴击率
    this.critRate = opts.critRate || 0;
    //韧性率
    this.toughnessRate = opts.toughnessRate || 0;
    //命中率
    this.hitRate = opts.hitRate || 0;
    //闪避率
    this.avoidRate = opts.avoidRate || 0;
};

function equipments(opts) {
    //武器
    this.weanpon = opts.weanpon || 0;
    //头部
    this.head = opts.head || 0;
    //身体
    this.body = opts.body || 0;
    //脚
    this.foot = opts.foot || 0;
    //手
    this.hand = opts.hand || 0;
    //腰
    this.waist = opts.waist || 0;
    //项链
    this.necklace = opts.necklace || 0;
    //戒指
    this.ring = opts.ring || 0;
};

//装备属性
playerAttri.equipment = equipment;

function equipment(opts) {
    //名字
    this.name = opts.maxHp || 0;
    //类型: 1武器2头部3身体4脚5手6腰7项链8戒指
    this.type =  opts.type || 0;
    //最大血量
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
    //控制命中
    this.control = opts.control || 0;
    //控制抗性
    this.resistance = opts.resistance || 0;
    //治疗
    this.cure = opts.cure || 0;
};

//角色属性概率
playerAttri.AttriRate = AttriRate;

function AttriRate(opts) {
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
    var array1 = [
        [0, 1, 0],
        [20, 2, 20],
        [60, 3, 40],
        [120, 4, 60],
        [200, 5, 80],
        [300, 6, 100],
        [420, 7, 120],
        [560, 8, 140],
        [720, 9, 160],
        [900, 10, 180],
        [1100, 11, 200],
        [1320, 12, 220],
        [1560, 13, 240]
    ];
    var array2 = [20, 60, 120, 200, 300, 420, 560, 720, 900, 1100, 1320, 1560];
    var index = underscore.sortedIndex(array2, x);
    rate = Math.floor((x - array1[index][0]) / array1[index][1]) + array1[index][2];
    return rate;
};
//升级
playerAttri.lvlup = function(player) {
    player.basicAttri.maxHp += 2;
    player.basicAttri.attack += 2;
    player.basicAttri.hit += 1;
    player.basicAttri.avoid += 1;
    player.basicAttri.defend += 1;
    player.basicAttri.control += 1;
    player.basicAttri.resistance += 1;
    player.basicAttri.attriPoint += 5;
    player.lvl += 1;
};
//计算力量属性
function str(player, num) {
    player.fightAttri.attack += num * 1;
}

//计算体质属性
function con(player, num) {
    player.fightAttri.defend += num * 1;
    player.fightAttri.maxHp += num * 2;
};

//计算意志属性
function wil(player, num) {
    player.fightAttri.critHurt += num * 0.2;
    player.fightAttri.resistance += 1;
};

//计算敏捷属性
function dex(player, num) {
    player.fightAttri.crit += num * 1;
    player.fightAttri.avoid += num * 1;
};

//计算精神属性
function spi(player, num) {
    player.fightAttri.cure += num * 1;
    player.fightAttri.control += num * 2;
    player.fightAttri.maxHp += num * 1;
};

//计算基础属性
function calcBasicAttri(player) {
    //血量
    player.fightAttri.maxHp += player.basicAttri.maxHp;
    //攻击力
    player.fightAttri.attack += player.basicAttri.attack;
    //防御
    player.fightAttri.defend += player.basicAttri.defend;
    //暴击伤害
    player.fightAttri.critHurt += player.basicAttri.critHurt;
    //暴击
    player.fightAttri.crit += player.basicAttri.crit;
    //韧性
    player.fightAttri.toughness += player.basicAttri.toughness;
    //命中
    player.fightAttri.hit += player.basicAttri.hit;
    //闪避
    player.fightAttri.avoid += player.basicAttri.avoid;
    //控制
    player.fightAttri.control += player.basicAttri.control;
    //抗性
    player.fightAttri.resistance += player.basicAttri.resistance;
};

//计算属性概率
function calcAllRate(player) {
    player.fightAttri.critRate = calcRate(player.fightAttri.crit);
    player.fightAttri.toughnessRate = calcRate(player.fightAttri.toughness);
    player.fightAttri.hitRate = calcRate(player.fightAttri.hit);
    player.fightAttri.avoidRate = calcRate(player.fightAttri.avoid);
};
//计算人物属性
playerAttri.calcPlayer = function(player) {
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
    player.fightAttri.hp = player.fightAttri.maxHp;
    //技能
    player.fightAttri.skills = player.skills;
    player.fightAttri.name = player.name;
    player.fightAttri.type = player.type;
}