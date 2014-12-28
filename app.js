var path = require('path');
var server = require('./app/http');
var fs = require('fs');
var playerAttri = require("./app/servers/http/playerAttri");
//var serversPath = path.join(__dirname + '/config/servers.json');
//var servers = require(serversPath);
var serverconf = {
    name: "http",
    port: 8001,
    host: "127.0.0.1",
    protocol: "http"
}
var app = {
    getBase: __dirname + '/'
};
global.lvlexp = require('./app/util/lvlexp').lvlup;

global.monsterMap = {};
fs.readdirSync("./app/config/monster").forEach(function(file) {
    //初始化怪物
    if (/^\d+.js$/.test(file)) {
        var routePath = path.join('./app/config/monster', file);
        var i = file.indexOf('.js');
        var str = file.substring(0, i);
        global.monsterMap[str] = require('./app/config/monster/' + file);
        var queue = [];
        for (var i in global.monsterMap[str]) {
            if (global.monsterMap[str].hasOwnProperty(i)) { //filter,只输出man的私有属性
                global.monsterMap[str][i] = new playerAttri.Monster(global.monsterMap[str][i]);
                playerAttri.calcPlayer(global.monsterMap[str][i]);
                queue.push(i)
            };
        }
        global.monsterMap[str].queue = queue;
    }
});
//console.log(global.monsterMap);

global.equipments = {};
fs.readdirSync("./app/config/equipment").forEach(function(file) {
    //初始化装备
    if (/^\d+.js$/.test(file)) {
        var routePath = path.join('./app/config/equipment', file);
        var i = file.indexOf('.js');
        var str = file.substring(0, i);
        global.equipments[str] = require('./app/config/equipment/' + file);
        for (var i in global.equipments[str]) {
            if (global.equipments[str].hasOwnProperty(i)) { //filter,只输出man的私有属性
                global.equipments[str][i] = new playerAttri.equipment(global.equipments[str][i]);
            };
        }
    }
});
//console.log(global.equipments);
server(app, serverconf);

/*	case 201000:
		//烽火连天 连续攻击单个敌人三次。使用后需休息一回合。
		battle2(player, defendQueue, defenders, defenderRecords, SKILLATTACK, {}, 3);
		break;
	case 202000:
		//鬼舞斩杀：100%暴击
		opt.critRate = 100;
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 203000:
		//箭雨:攻击2-4人
		battle2(player, defendQueue, defenders, defenderRecords, SKILLATTACK, {}, 3);
		break;
	case 203000:
		//腐蚀之箭：使武器带上腐蚀的buff。buff持续3回合
		battle1(player, defendQueue, defenderRecords, NORMALATTACK, {
			damage : 200
		}, function (p) {
			p.fightAttri.defend = p.fightAttri.defend - 10;
			var buff = {
				id : 203000,
				tick : 3,
				value : [10],
				player : p;
			};
			buffOper.push(buff);
		});

		break;
	case 204000:
		//破血狂攻：无视敌人10%护甲，伤害增加30%，暴击率提升30%
		opt = {
			reduceDefend : 10,
			damageRate : 30,
			critRate : 30
		}
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 205000:
		//炼魂：提升命中率，暴击率，暴击伤害，buff
		player.fightAttri.hitRate = player.fightAttri.hitRate + 10;
		player.fightAttri.critRate = player.fightAttri.critRate + 10;
		player.fightAttri.critHurt = player.fightAttri.critHurt + 10;
		var buff = {
			id : 205000,
			tick : 3,
			value : [10],
			player : player;
		};
		buffOper.push(buff);
	case 206000： //凝风斩：对单个敌人施展物理攻击
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt);
	case 301000:
		//点穴封脉: 使单个敌人在一定回合内无法恢复生命及生命上限。
	case 302000:
		//圣元回天：复活单个死亡的队友。

	case 303000:
		//星辰变:使多个敌人生命受到固定伤害。可攻击的敌人数随心法等级增加。
		opt = {
			damage : 100
		}
		battle2(player, defendQueue, defenders, defenderRecords, SKILLATTACK, opt, 3);
		break;
	case 304000:
		//沛雨甘霖：为多个队友持续恢复生命。可作用的队友数随心法等级增加。
		var k = getRandom(playerQueue.length, 3);
		for (var i = 0; i < num; i++) {
			var buff = {
				id : 205000,
				tick : 3,
				value : [10],
				player : playerQueue[k[num]];
			};
			buffOper.push(buff);
		}
		break;
	case 305000:
		//清风如穆: 对多个敌人施展物理攻击，可攻击的敌人数随心法等级增加。该技能只能对怪物使用。
		battle2(player, defendQueue, defenders, defenderRecords, PHYSICALATTACK, opt, 3);
	case 306000:
		//回风拂柳: 对单个敌人进行连续两次的物理攻击
		battle3(player, defendQueue, defenders, defenderRecords, PHYSICALATTACK, {}, 2);
	case 307000:
		//去腐生肌: 解除多个队友的毒及属性损益状态影响。可作用的队友数随心法等级增加。
	case 401000:
		//舍我其谁：附加失去血量的百分比伤害
		opt = {
			damageRate : (1 - player.hp / player.maxHp)
		}
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 402000:
		//狂暴旋风: 攻击所有敌人，伤害递减
		opt = {
			damageRate : -30
		}
		battle2(player, defendQueue, defenders, defenderRecords, SKILLATTACK, opt, defendQueue.length, function (p, popt) {
			opt = {
				damageRate : opt.damageRate - 10
			}
		});
		break;
	case 403000:
		//孤注一掷：伤害增加30%，防御降低20%
		player.damageRate = player.damageRate + 30;
		battle2(player, defendQueue, defenders, defenderRecords, SKILLATTACK, opt, defendQueue.length, function (p, opt) {
			opt = {
				damageRate : opt.damageRate - 10
			}
		});
		var buff = {
			id : 205000,
			tick : 3,
			value : [10],
			player : player;
		};
		buffOper.push(buff);
		break;
	case 404000:
		//暴怒：提升自身的攻击力和血量上线
	case 405000:
		//冲撞：附加额外伤害，并一定概率击晕敌人，使敌人无法行动一回合，同时自己也受到一定伤害
		opt = {
			damageRate : 30
		}
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt, function (p) {
			p.battleStatus = 1; //眩晕，昏睡，
		});
		var buff = {
			id : 405000,
			tick : 1,
			player : playerQueue[k[num]];
		};
		buffOper.push(buff);
		break;
	case 406000:
		//龙啸九天：攻击3个敌人
		battle2(player, defendQueue, defenders, defenderRecords, PHYSICALATTACK, opt, 3);
	case 501000:
		//死亡之触：攻击敌人，并造成敌人血量上限x%的伤害
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt, function (p, opt) {
			opt = {
				damageRate : p.hp * 0.03
			}
		});
	case 502000:
		//死亡之读：使多个敌人中毒

	case 503000:
		//元神禁锢：使多个敌人昏睡
		var k = getRandom(defendQueue.length, 3);
		for (var i = 0; i < num; i++) {
			defendQueue[k[num]].battleStatus = 2;
		}
		break;
	case 504000:
		//附魔攻击
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt);
	case 505000:
		//击晕：附加额外伤害，并一定概率击晕敌人，使敌人无法行动一回合，
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt, function (p) {
			p.battleStatus = 1; //眩晕，昏睡，
		});
		break;
	case 506000: //不动如山：减轻自己所受到的一定次数物理伤害*/