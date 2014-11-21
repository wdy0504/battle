NORMALATTACK = 1;
PHYSICALATTACK = 2;
SKILLATTACK = 3;

exports.skillAttack = function (player, playerQueue, defendQueue, buffOper, defenderRecords) {
	var opt = {
		damagePer : 0,
		avoidRate : 0,
		critRate : 0,
		vampirePer : 0,
		damage : 0,
		hitRate : 0,
		attack : 0,
		reduceDefendPer : 0,
		reduceDamagePer : 0
	}
	var skillId = player.skills[player.skillPos];
	switch (skillId) {
	case 101000:
		//血性狂击。攻击敌人，并恢复伤害的20%的血量
		opt.vampirePer = 20;
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 102000:
		//羽之守护:增加宠物的防御力，闪避率，回血速度buff
		player.pet.fightAttri.defend = player.pet.fightAttri.defend + 10;
		player.pet.fightAttri.recoverHp = player.pet.fightAttri.recoverHp + 10;
		player.pet.fightAttri.avoidRate = player.pet.fightAttri.avoidRate + 10;
		var buff = {
			id : 102000,
			tick : 3,
			value : [10, 10, 10],
			player : player.pet;
		};
		buffOper.push(buff);
		break;
	case 103000:
		//兽王击。附加宠物的50%的攻击力，并给予敌人一击
		opt.attack = Math.floor(player.pet.fightAttri.attack * 0.5);
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt);
	case 104000:
		//狼嚎。增加宠物攻击力，暴击率，暴击伤害
		player.pet.fightAttri.attack = player.pet.fightAttri.attack + 10;
		player.pet.fightAttri.critRate = player.pet.fightAttri.critRate + 10;
		player.pet.fightAttri.critHurt = player.pet.fightAttri.critHurt + 10;
		var buff = {
			id : 104000,
			tick : 3,
			value : [10, 10, 10],
			player : player.pet;
		};
		buffOper.push(buff);
		break;
	case 105000:
		//心灵相通。给自己和宠物恢复一定的血量。
		if(player.pet.hp>0){
			player.pet.hp = player.pet.hp + 100;
		}
		player.hp = player.hp + 100;
		break;
	case 106000:
		//自然之怒:攻击2-3人,伤害递减
		battle2(player, defendQueue, defenderRecords, SKILLATTACK, opt, 3, function(p, popt){
			
		});
		break;
	case 107000:
		//弈剑回风：暴击率提升10%对单个敌人施展物理攻击
		opt = {
			player.fightAttri.attack = player.fightAttri.attack + 20;
		}
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 108000:
		//招魂术,复活自己的宠物
		if (player.pet.hp > 0) {
			battle1(player, defendQueue, defenderRecords, NORMALATTACK);
		} else {
			player.pet.hp = player.pet.maxHp * 0.1;
			playerQueue.push(player.pet);
		}
		break;
	case 201000:
		//烽火连天 连续攻击单个敌人三次。使用后需休息一回合。
		battle2(player, defendQueue, defenders, defenderRecords, SKILLATTACK, {}, 3);
		break;
	case 202000:
		//鬼舞斩杀：100%暴击
		opt = {
			critRate : 100
		}
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
	case 506000: //不动如山：减轻自己所受到的一定次数物理伤害
	}
	return damage;
}
exports.buffOper = function (id, player, buff) {
	switch (id) {
	case 2001:
		//增加50%闪避
		player.fightAttri.avoidRate -= buff.value[0];
		break;
	case 2002:
		//嗜血术。为自己的宠物附加吸血的buff,挺升宠物10攻击力
		player.fightAttri.vampire -= buff.value[0];
		player.fightAttri.attack -= buff.value[1];
		break;
	case 2003:
		//嗜血术。为自己的宠物附加吸血的buff,挺升宠物10攻击力
		player.fightAttri.vampire -= buff.value[0];
		player.fightAttri.attack -= buff.value[1];
		break;
	}
}

//计算技能伤害
function calcSkilldamage(attacker, defender, attackType, oper, opt) {
	var damage = 0;
	var damagePer = 100;
	var content = '';
	if (attackType === 1) {
		//是否闪避
		var rate = defender.attriRate.avoidRate - opt.hitRate - attacker.attriRate.hitRate;
		rate = rate < 0 ? 10 : (rate > 80 ? 80 : rate);
		if (Math.floor(Math.random() * 100) <= rate) {
			oper.reacOper = 2;
			//console.log(player2.name + '闪避了' + player2.name + '的攻击——————(' + player1.name + '的hp:' + player1.hp +';' + player2.name + '的hp:' + player2.hp')');
			return ;
		}
	}
	//是否暴击
	rate = attacker.attriRate.critRate + opt.critRate - defender.attriRate.toughnessRate;
	if (Math.floor(Math.random() * 100) <= rate) {
		oper.reacOper = 1;
		damagePer = damagePer + attacker.fightAttri.critHurt + opt.critHurt;
	}
	//计算伤害
	damage = attacker.fightAttri.attack + opt.attack - defender.fightAttri.defend + defender.fightAttri.defend * opt.reduceDefendPer / 100;
	oper.damage = Math.floor(damage * (damagePer + opt.damagePer - defender.fightAttri.reduceDamagePer -  opt.reduceDamagePer) / 100);
	defender.hp = defender.hp - damage;
	if (attacker.vampirePer > 0 && attackType !== 3) {
		hp = attacker.hp + damage * attacker.vampirePer / 100;
		oper.vampireHurt = hp < attacker.maxHp ? hp : attacker.maxHp;
		attacker.hp = attacker.hp + oper.vampireHurt;
	}
	//console.log(player2.name + '受到' + player2.name + '的' + damage + '伤害——————(' + player1.name + '的hp:' + player1.hp +';' + player2.name + '的hp:' + player2.hp')');
	return ;
};
//
function battle1(attacker, defendQueue, defenderRecords, attackType, opt, func) {
	var oper = {
		reacOper : 0,
		vampireHurt : 0,
		damage : 0
	};
	var index = Math.floor(Math.random() * defendQueue.length);
	var p = defendQueue[index];
	if (func) {
		func(p, opt);
	}
	
	calcSkilldamage(attacker, p, attackType, oper, opt);
	
	defender = {
		blood : p.hp,
		oper : oper,
		player : new Player(p),
		pos : p.pos
	};
	defenderRecords.push(defender);
	if (p.hp < 0) {
		defendQueue.splice(index2, 1);
	}
}

function battle2(attacker, defendQueue, defenderRecords, attackType, opt, func, num) {
	var k = getRandom(defendQueue.length, num);
	var oper = {
		reacOper : 0,
		vampireHurt : 0,
		damage : 0
	};
	for (var i = 0; i < num; i++) {
		var p = defendQueue[k[i]];
		if (func) {
			func(p, opt);
		}
		calcSkilldamage(attacker, p, attackType, oper, opt);		
		defender = {
			blood : p.hp,
			player : new Player(p),
			pos : p.pos,
			oper : oper
		};
		defenderRecords.push(defender);
		if (p.hp < 0) {
			defendQueue.splice(k[i], 1);
		}
	}
}

function battle3(attacker, defendQueue, defenderRecords, attackType, opt, func, time) {
	var oper = {
		reacOper : 0,
		vampireHurt : 0,
		damage : 0
	};
	var index = Math.floor(Math.random() * defendQueue.length);
	var p = defendQueue[index];
	for (var i = 0; i < time; i++) {
		if (func) {
			func(p, opt);
		}
		calcSkilldamage(attacker, p, attackType, oper, opt);		
		defender = {
			blood : p.hp,
			oper ： oper,
			player : new Player(p),
			pos : p.pos
		};
		defenderRecords.push(defender);
		if (p.hp < 0) {
			tmp2.splice(index, 1);
			break;
		}
	}
}

function battling(attackQueue, playerQueue, defendQueue, round, buffOper, fightRecord) {
	var defenderRecords = [];
	while (true) {
		var index = Math.floor(Math.random() * attackQueue.length);
		var p = attackQueue.splice(index1, 1)[0];
		if (attackQueue[index].hp > 0) {
			skillAttack(p, playerQueue, defendQueue, buffOper, defenderRecords);
		} else {
			continue;
		}
		var attacker = {
			blood : p.hp,
			pos : p.pos,
			player : new Player(p)
		};

		var fightAction = {
			round : round,
			attacker : attacker,
			defenderRecords : defenderRecords
		};
		fightRecord.fightActions.push(fightAction);
		break;
	}
};

exports.startBattle(attackQueue1, attackQueue2, defendQueue1, defendQueue2) {
	var round = 0;
	while (defendQueue1.length > 0 && defendQueue2.length > 0) {
		while ((attackQueue1.length > 0 && defendQueue2.length > 0) || (attackQueue2.length > 0 && defendQueue1.length > 0)) {
			if (attackQueue1.length > 0 && defendQueue2.length > 0) {
				battling(attackQueue1, defendQueue1, defendQueue2, round, gBuffOper, fightRecord);
			}
			if (attackQueue2.length > 0 && defendQueue1.length > 0) {
				battling(attackQueue2, defendQueue2, defendQueue1, round, gBuffOper, fightRecord);
			}
		}
		attackQueue1 = defendQueue1.slice();
		attackQueue2 = defendQueue2.slice();
		//回合结束 计算buff
		/*var length = gBuffOper.length;
		for (var i = 0; i < length; i++) {
		gBuffOper[i].tick--;
		if (gBuffOper[i].tick == 0) {
		buffOper(gBuffOper[i].id, gBuffOper[i].player);
		}
		}*/
		round++;
	}
}

function getRandom(length, num) {
	var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	if(length<=num){
		return a.slice(1,length).reverse();
	}
	var k = [];
	for (var i = 0; i < num; i++) {
		var l = Math.floor(Math.random() * length);
		length = length - 1;
		k.push(a[l]);
		a[l] = a[length];
	}
	return k.reverse();
}
