NORMALATTACK = 1;
PHYSICALATTACK = 2;
SKILLATTACK = 3;

function skillAttack(attacker, playerQueue, defendQueue, buffOper, defenderRecords) {
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
	var skillId = attacker.skills[attacker.skillPos];
	switch (skillId) {
	case 101000:
		//血性狂击。攻击敌人，并恢复伤害的20%的血量
		opt.vampirePer = 20;
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 102000:
		//羽之守护:增加宠物的防御力，闪避率，回血速度buff
		attacker.pet.fightAttri.defend = attacker.pet.fightAttri.defend + 10;
		attacker.pet.fightAttri.recoverHp = attacker.pet.fightAttri.recoverHp + 10;
		attacker.pet.fightAttri.avoidRate = attacker.pet.fightAttri.avoidRate + 10;
		var buff = {
			id : 102000,
			tick : 3,
			value : [10, 10, 10],
			player : player.pet
		};
		buffOper.push(buff);
		buff
		
		break;
	case 103000:
		//兽王击。附加宠物的50%的攻击力，并给予敌人一击
		opt.attack = Math.floor(player.pet.fightAttri.attack * 0.5);
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
	case 104000:
		//狼嚎。增加宠物攻击力，暴击率，暴击伤害
		attacker.pet.fightAttri.attack = attacker.pet.fightAttri.attack + 10;
		attacker.pet.fightAttri.critRate = attacker.pet.fightAttri.critRate + 10;
		attacker.pet.fightAttri.critHurt = attacker.pet.fightAttri.critHurt + 10;
		var buff = {
			id : 104000,
			tick : 3,
			value : [10, 10, 10],
			player : attacker.pet
		};
		buffOper.push(buff);
		break;
	case 105000:
		//心灵相通。给自己和宠物恢复一定的血量。
		if (attacker.pet.hp > 0) {
			attacker.pet.hp = attacker.pet.hp + 100;
		}
		attacker.hp = attacker.hp + 100;
		break;
	case 106000:
		//自然之怒:攻击2-3人,伤害递减
		battle2(attacker, defendQueue, defenderRecords, SKILLATTACK, opt, function (p, popt) {
			popt.reduceDamagePer = -10;
		}, 3);
		break;
	case 107000:
		//弈剑回风：暴击率提升10%对单个敌人施展物理攻击
		opt.critRate = 10;
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 108000:
		//招魂术,复活自己的宠物
		if (player.pet.hp > 0) {
			battle1(player, defendQueue, defenderRecords, NORMALATTACK, opt);
		} else {
			player.pet.hp = player.pet.maxHp * 0.1;
			playerQueue.push(player.pet);
		}
		break;
	}
	
	attacker.skillPos = attacker.skillPos === 4 ? 1 :  attacker.skillPos + 1; 
	return;
}

function buffOper(id, player, buff) {
	switch (id) {
	case 102000:
		//增加宠物的防御力，闪避率，回血速度buff
		player.fightAttri.defend -= buff.value[0];
		player.fightAttri.recoverHp -= buff.value[1];
		player.fightAttri.avoidRate -= buff.value[2];
		break;
	case 104000:
		//狼嚎。增加宠物攻击力，暴击率，暴击伤害
		player.fightAttri.attack -= buff.value[0];
		player.fightAttri.critRate -= buff.value[1];
		player.fightAttri.critHurt -= buff.value[2];
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
			return;
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
	oper.damage = Math.floor(damage * (damagePer + opt.damagePer - defender.fightAttri.reduceDamagePer - opt.reduceDamagePer) / 100);
	defender.hp = defender.hp - damage;
	if (attacker.vampirePer > 0 && attackType !== 3) {
		hp = attacker.hp + damage * attacker.vampirePer / 100;
		oper.vampireHurt = hp < attacker.maxHp ? hp : attacker.maxHp;
		attacker.hp = attacker.hp + oper.vampireHurt;
	}
	//console.log(player2.name + '受到' + player2.name + '的' + damage + '伤害——————(' + player1.name + '的hp:' + player1.hp +';' + player2.name + '的hp:' + player2.hp')');
	return;
};

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
		pos : p.pos
		//player : new Player(p),
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
			pos : p.pos,
			oper : oper
			//player : new Player(p),
		};
		defenderRecords.push(defender);
		if (p.hp < 0) {
			defendQueue.splice(k[i], 1);
		}
	}
}

function battle3(attacker, defendQueue, defenderRecords, attackType, opt, func, times) {
	var oper = {
		reacOper : 0,
		vampireHurt : 0,
		damage : 0
	};
	var index = Math.floor(Math.random() * defendQueue.length);
	var p = defendQueue[index];
	for (var i = 0; i < times; i++) {
		if (func) {
			func(p, opt);
		}
		calcSkilldamage(attacker, p, attackType, oper, opt);
		defender = {
			blood : p.hp,
			oper ： oper,
			pos : p.pos
			//player : new Player(p),
		};
		defenderRecords.push(defender);
		if (p.hp < 0) {
			defendQueue.splice(index, 1);
			break;
		}
	}
}

function battling(attackQueue, playerQueue, defendQueue, round, buffOper, fightRecord) {
	var defenderRecords = [];
	while (true) {
		var index = Math.floor(Math.random() * attackQueue.length);
		var attacker = attackQueue.splice(index1, 1)[0];
		if (attackQueue[index].hp > 0) {
			skillAttack(attacker, playerQueue, defendQueue, buffOper, defenderRecords);
		} else {
			continue;
		}
		var attackRecord = {
			blood : attacker.hp,
			pos : attacker.pos,
			//player : new Player(p)
		};

		var fightAction = {
			round : round,
			attackerRecord : attackerRecord,
			defenderRecords : defenderRecords
		};
		fightRecord.fightActions.push(fightAction);
		break;
	}
};

exports.startBattle(fightStructTmp1, fightStructTmp2) {
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
	fightRecord = {
		roundCount:0,
		attack:0,
		fightActions:[]
		}
	fightRecord.attack.push(palyer1);
	fightRecord.attack.push(pet1);
	fightRecord.defend.push(palyer2);
	fightRecord.defend.push(pet2);

	//战斗队列
	attackQueue1 = fightStructTmp1.slice();
	//战斗队列
	attackQueue2 = fightStructTmp2.slice();
	//场上的人
	defendQueue1 = fightStructTmp1.slice();
	//场上的人
	defendQueue2 = fightStructTmp2.slice();
	
	var round = 0;
	var fightRecord = {};
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
		var length = gBuffOper.length;
		var buffs = [];
		for (var i = 0; i < length; i++) {
			gBuffOper[i].tick--;
			if (gBuffOper[i].tick == 0) {
				buffOper(gBuffOper[i].id, gBuffOper[i].player);
			}else{
				var buff = {
					id : gBuffOper[i].id,
					pos : gBuffOper[i].player.pos,
					round : round
				}
				buffs.push(buff);
			}
		}
		fightRecord.buffs.push(buffs);
		round++;
	}
}

function getRandom(length, num) {
	var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	if (length <= num) {
		return a.slice(1, length).reverse();
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
