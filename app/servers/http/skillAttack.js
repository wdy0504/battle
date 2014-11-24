NORMALATTACK = 1;
PHYSICALATTACK = 2;
SKILLATTACK = 3;

function skillAttack(attacker, playerQueue, defendQueue, buffOper, defenderRecords) {
	var opt = {
		damagePer : 0,
		avoidRate : 0,
		critRate : 0,
		critHurt : 0,
		vampirePer : 0,
		damage : 0,
		hitRate : 0,
		attack : 0,
		reduceDefendPer : 0,
		reduceDamagePer : 0
	}
	var skillId = attacker.skills[attacker.skillPos];
	console.log(attacker.name + '使用了技能' + skillId );
	switch (skillId) {
	case 0:
		//普通攻击：
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 101000:
		//血性狂击。攻击敌人，并恢复伤害的20%的血量(物理)
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
			player : attacker.pet
		};
		buffOper.push(buff);
		break;
	case 103000:
		//兽王击。附加宠物的50%的攻击力，并给予敌人一击(物理)
		opt.attack = Math.floor(attacker.pet.fightAttri.attack * 0.5);
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
		if (attacker.pet.hp > 0 && && attacker.pet.status !== 1) {
			attacker.pet.hp = attacker.pet.hp + 100;
		}
		if (attacker.status !== 1) {
			attacker.hp = attacker.hp + 100;
		}
		break;
	case 106000:
		//自然之怒:攻击2-3人,伤害递减(技能)
		battle2(attacker, defendQueue, defenderRecords, SKILLATTACK, opt, function (p, popt) {
			popt.reduceDamagePer = -10;
		}, 3);
		break;
	case 107000:
		//弈剑回风：暴击率提升10%对单个敌人施展物理攻击(物理)
		opt.critRate = 10;
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 108000:
		//招魂术,复活自己的宠物
		if (attacker.pet.hp > 0) {
			battle1(attacker, defendQueue, defenderRecords, NORMALATTACK, opt);
		} else {
			attacker.pet.hp = attacker.pet.maxHp * 0.1;
			playerQueue.push(attacker.pet);
		}
		break;
	case 201000:
		//烽火连天 连续攻击单个敌人2次。(物理)
		battle2(attacker, defendQueue, defenders, defenderRecords, SKILLATTACK, opt, null, 2);
		break;
	case 202000:
		//鬼舞斩杀：100%暴击(物理)
		opt.critRate = 1000;
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 203000:
		//箭雨:攻击2-3人(物理)
		battle2(attacker, defendQueue, defenders, defenderRecords, SKILLATTACK, {}, 3);
		break;
	case 204000:
		//腐蚀之箭：使武器带上腐蚀的buff。buff持续3回合(物理)
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt, function (p, popt) {
			p.fightAttri.defend = p.fightAttri.defend - 10;
			var buff = {
				id : 203000,
				tick : 3,
				value : [-10],
				player : p
			};
			buffOper.push(buff);
		});
		break;
	case 205000:
		//破血狂攻：无视敌人10%护甲，伤害增加30%，暴击率提升30%(物理)
		opt.damageRate = 30;
		opt.critRate = 30;
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt, function(p, popt){
			popt.reduceDefend = p.defend * 0.1
		});
		break;
	case 206000:
		//炼魂：提升命中率，暴击率，暴击伤害，buff
		attacker.fightAttri.hitRate = attacker.fightAttri.hitRate + 10;
		attacker.fightAttri.critRate = attacker.fightAttri.critRate + 10;
		attacker.fightAttri.critHurt = attacker.fightAttri.critHurt + 10;
		var buff = {
			id : 206000,
			tick : 3,
			value : [10,10,10],
			player : attacker
		};
		buffOper.push(buff);
		break;
	case 207000： //凝风斩：对单个敌人施展攻击(技能)
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 208000: //箭芒：攻击2-3人,伤害递减(技能)
		battle2(attacker, defendQueue, defenderRecords, SKILLATTACK, opt, function (p, popt) {
			popt.reduceDamagePer = -10;
		}, 2);
		break;
	case 301000:
		//点穴封脉: 使单个敌人在一定回合内无法恢复生命。
		var index = Math.floor(Math.random() * defendQueue.length);
		defendQueue[index].status = 1;
		var buff = {
			id : 301000,
			tick : 3,
			player : defendQueue[index]
		};
		buffOper.push(buff);
		break;
	case 302000:
		//圣元回天：复活单个死亡的队友。
		break;
	case 303000:
		//星辰变:使多个敌人生命受到固定伤害。可攻击的敌人数随心法等级增加。(技能)
		opt = {
			damage : 100
		}
		battle2(attacker, defendQueue, defenders, defenderRecords, SKILLATTACK, opt, 3);
		break;
	case 304000:
		//沛雨甘霖：为多个队友持续恢复生命。可作用的队友数随心法等级增加。
		var k = getRandom(playerQueue.length, 3);
		for (var i = 0; i < num; i++) {
			var p = playerQueue[k[num]];
			var buff = {
				id : 304000,
				tick : 3,
				value : [50],
				player : p
			};
			buffOper.push(buff);
			if (p.status !== 1) {
				p.hp = p.hp + 50;
			}
		}
		break;
	case 305000:
		//清风如穆: 对多个敌人施展物理攻击，可攻击的敌人数随心法等级增加。该技能只能对怪物使用。(物理)
		battle2(attacker, defendQueue, defenders, defenderRecords, PHYSICALATTACK, opt, 3);
	case 306000:
		//回风拂柳: 对单个敌人进行连续两次的物理攻击(物理)
		battle3(attacker, defendQueue, defenders, defenderRecords, PHYSICALATTACK, {}, 2);
	case 307000:
		//去腐生肌: 回复单个队友的血量
		var index = Math.floor(Math.random() * defendQueue.length);
		var p = playerQueue[index];
		if (p.status !== 1) {
			p.hp = p.hp + 150;
		}
		break;
	case 308000:
		//炽热光环，为队友提供一个20%减伤护盾，护盾持续3回合
		var k = getRandom(playerQueue.length, 3);
		for (var i = 0; i < num; i++) {
			var p = playerQueue[k[num]];
			p.reduceDamagePer = p.reduceDamagePer + 20;
			var buff = {
				id : 308000,
				tick : 3,
				value : [20],
				player : p
			};
			buffOper.push(buff);
		}
		break;
	case 401000:
		//舍我其谁：附加失去血量的百分比伤害
		opt = {
			damageRate : (1 - attacker.hp / attacker.maxHp)
		}
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 402000:
		//狂暴旋风: 攻击所有敌人，伤害递减(技能)
		opt.damageRate = -20
		battle2(attacker, defendQueue, defenders, defenderRecords, SKILLATTACK, opt, defendQueue.length, function (p, popt) {
			opt = {
				damageRate : opt.damageRate - 15
			}
		});
		break;
	case 403000:
		//孤注一掷：伤害增加30%
		opt.damageRate + 30;
		battle1(attacker, defendQueue, defenders, defenderRecords, SKILLATTACK, opt);
		break;
	case 404000:
		//暴怒：提升自身的攻击力和防御力
		attacker.fightAttri.attack = attacker.fightAttri.attack + 10;
		attacker.fightAttri.defend = attacker.fightAttri.defend + 10;
		var buff = {
			id : 404000,
			tick : 3,
			value : [10,10],
			player : attacker
		};
		buffOper.push(buff);
	case 405000:
		//冲撞：附加额外伤害，并一定概率击晕敌人，使敌人无法行动一回合
		opt.damageRate = 30
		battle1(player, defendQueue, defenderRecords, PHYSICALATTACK, opt, function (p) {
			p.battleStatus = 1; //眩晕，昏睡，
			var buff = {
				id : 405000,
				tick : 2,
				player :p
			};
			buffOper.push(buff);
		});
		break;
	case 406000:
		//龙啸九天：攻击3个敌人
		battle2(player, defendQueue, defenders, defenderRecords, PHYSICALATTACK, opt, 3);
		break;
	case 407000:
		//嗜血狂袭
		opt.vampirePer = 20;
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	}

	attacker.skillPos = attacker.skillPos === 3 ? 1 : attacker.skillPos + 1;
	return skillId;
}

function petSkillAttack(attacker, playerQueue, defendQueue, buffOper, defenderRecords) {
	var opt = {
		damagePer : 0,
		avoidRate : 0,
		critRate : 0,
		critHurt : 0,
		vampirePer : 0,
		damage : 0,
		hitRate : 0,
		attack : 0,
		reduceDefendPer : 0,
		reduceDamagePer : 0
	}
	var skillId = attacker.skills[attacker.skillPos];
	console.log(attacker.name + '使用了技能' + skillId );
	switch (skillId) {
	case 0:
		//普通攻击：
		battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
		break;
	case 111000:
		//寒水：
		battle1(attacker, defendQueue, defenderRecords, SKILLATTACK, opt);
		break;
	case 112000:
		//岩裂：
		battle1(attacker, defendQueue, defenderRecords, SKILLATTACK, opt);
		break;
	case 113000:
		//啸风：攻击2个敌人。(技能)
		battle2(attacker, defendQueue, defenderRecords, SKILLATTACK, opt, function (p, popt) {
			popt.reduceDamagePer = -10;
		}, 2);
	case 114000:
		//风起云涌：攻击3个敌人。(技能)
		battle2(attacker, defendQueue, defenderRecords, SKILLATTACK, opt, function (p, popt) {
			popt.reduceDamagePer = -10;
		}, 3);
	case 116000:
		//奕剑四方：攻击2个敌人。(物理)
		battle2(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt, function (p, popt) {
			popt.reduceDamagePer = -10;
		}, 2);
	case 116000:
		//奕剑八方：攻击3个敌人。(物理)
		battle2(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt, function (p, popt) {
			popt.reduceDamagePer = -10;
		}, 3);
	}
}
function buffOper(id, player, value) {
	switch (id) {
	case 102000:
		//增加宠物的防御力，闪避率，回血速度buff
		player.fightAttri.defend -= value[0];
		player.fightAttri.recoverHp -= value[1];
		player.fightAttri.avoidRate -= value[2];
		break;
	case 104000:
		//狼嚎。增加宠物攻击力，暴击率，暴击伤害
		player.fightAttri.attack -= value[0];
		player.fightAttri.critRate -= value[1];
		player.fightAttri.critHurt -= value[2];
		break;
	case 203000:
		//腐蚀之箭：使武器带上腐蚀的buff。buff持续3回合
		player.fightAttri.defend -= value[0];
		break;
	case 206000:
		//炼魂：提升命中率，暴击率，暴击伤害，buff
		player.fightAttri.hitRate -= value[0];
		player.fightAttri.critRate -= value[1];
		player.fightAttri.critHurt -= value[2];
		break;
	case 301000:
		//点穴封脉: 使单个敌人在一定回合内无法恢复生命。
		player.status = 0;
		break;
	case 304000:
		//沛雨甘霖：为多个队友持续恢复生命。可作用的队友数随心法等级增加。
		break;
	case 308000:
		//炽热光环，为队友提供一个20%减伤护盾，护盾持续3回合
		player.fightAttri.reduceDamagePer -= value[0];
		break;
	case 404000:
		//暴怒：提升自身的攻击力和防御力
		player.fightAttri.attack -= value[0];
		player.fightAttri.defend -= value[1];
		break;
	case 405000:
		//冲撞：附加额外伤害，并一定概率击晕敌人，使敌人无法行动一回合
		player.battleStatus = 1;
		break;
	}
}

//计算技能伤害
function calcSkilldamage(attacker, defender, attackType, oper, opt) {
	if(opt.damage>0){
		defender.hp = damage = defender.hp - damage;
		oper.damage = opt.damage;
		console.log(defender.name + '受到' + attacker.name + '的' + opt.damage + '固定伤害——————(' + attacker.name + '的hp:' + attacker.hp +';' + defender.name + '的hp:' + defender.hp + ')');
		return;
	}
	var damage = 0;
	var damagePer = 100;
	var content = '';
	if (attackType !== 3) {
		//是否闪避
		var rate = defender.attriRate.avoidRate - opt.hitRate - attacker.attriRate.hitRate;
		rate = rate < 0 ? 10 : (rate > 80 ? 80 : rate);
		if (Math.floor(Math.random() * 100) <= rate) {
			oper.reacOper = 2;
			console.log(defender.name + '闪避了' + attacker.name + '的攻击——————(' + attacker.name + '的hp:' + attacker.hp +';' + defender.name + '的hp:' + defender.hp + ')');
			return;
		}
	}
	if (attackType !== 3) {
		//是否暴击
		rate = attacker.attriRate.critRate + opt.critRate - defender.attriRate.toughnessRate;
		if (Math.floor(Math.random() * 100) <= rate) {
			oper.reacOper = 1;
			damagePer = damagePer + attacker.fightAttri.critHurt + opt.critHurt;
		}
	}
	//计算伤害
	damage = attacker.fightAttri.attack + opt.attack - defender.fightAttri.defend + defender.fightAttri.defend * opt.reduceDefendPer / 100;
	console.log(damagePer + '&' + opt.damagePer+ '&' +defender.fightAttri.reduceDamagePer+ '&' +opt.reduceDamagePer);
	oper.damage = Math.floor(damage * (damagePer + opt.damagePer - defender.fightAttri.reduceDamagePer - opt.reduceDamagePer) / 100);
	defender.hp = damage = defender.hp - damage;
	if (attacker.vampirePer > 0 && attackType !== 3 && attacker.status !== 1) {
		hp = attacker.hp + damage * attacker.vampirePer / 100;
		oper.vampireHurt = hp < attacker.maxHp ? hp : attacker.maxHp;
		attacker.hp = attacker.hp + oper.vampireHurt;
	}
	console.log(defender.name + '受到' + attacker.name + '的' + damage + '伤害——————(' + attacker.name + '的hp:' + attacker.hp +';' + defender.name + '的hp:' + defender.hp + ')');
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
		hp : p.hp,
		oper : oper,
		pos : p.pos,
		name : p.name
		//player : new Player(p),
	};
	defenderRecords.push(defender);
	if (p.hp < 0) {
		defendQueue.splice(index, 1);
	}
}

function battle2(attacker, defendQueue, defenderRecords, attackType, opt, func, num) {
	var k = getRandom(defendQueue.length, num);
	var oper = {
		reacOper : 0,
		vampireHurt : 0,
		damage : 0
	};
	var l = k.length;
	for (var i = 0; i < l; i++) {
		var p = defendQueue[k[i]];
		if (func) {
			func(p, opt);
		}
		
		calcSkilldamage(attacker, p, attackType, oper, opt);
		defender = {
			hp : p.hp,
			pos : p.pos,
			oper : oper,
			name : p.name
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
			hp : p.hp,
			oper : oper,
			pos : p.pos,
			name : p.name
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
	var skillId;
	while (attackQueue.length > 0) {
		var index = Math.floor(Math.random() * attackQueue.length);
		var attacker = attackQueue.splice(index, 1)[0];
		
		if (attacker.hp > 0 ) {
			skillId = skillAttack(attacker, playerQueue, defendQueue, buffOper, defenderRecords);
		} else if(attacker.battleStatus !== 1){
			break;
		} else {
			continue;
		}
		var attackerRecord = {
			hp : attacker.hp,
			pos : attacker.pos,
			skillId : skillId,
			name : attacker.name
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

exports.startBattle = function(fightStructTmp1, fightStructTmp2){
	gBuffOper = [];
	fightRecord = {
		roundCount : 0,
		queue1 : [],
		queue2 : [],
		fightActions : [],
		buffs: []
	}
	for (var i in fightStructTmp1) {
		var j = {
			name : fightStructTmp1[i].name,
			maxHp : fightStructTmp1[i].maxHp,
			hp : fightStructTmp1[i].hp
		}
		fightRecord.queue1.push(j);
	}

	for (var i in fightStructTmp2) {
		var j = {
			name : fightStructTmp1[i].name,
			maxHp : fightStructTmp2[i].maxHp,
			hp : fightStructTmp2[i].hp
		}
		fightRecord.queue2.push(j);
	}

	//战斗队列
	attackQueue1 = fightStructTmp1.slice();
	//战斗队列
	attackQueue2 = fightStructTmp2.slice();
	//场上的人
	defendQueue1 = fightStructTmp1.slice();
	//场上的人
	defendQueue2 = fightStructTmp2.slice();

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
		var length = gBuffOper.length;
		var buffs = [];
		for (var i = 0; i < length; i++) {
			gBuffOper[i].tick--;
			if (gBuffOper[i].tick == 0) {
				buffOper(gBuffOper[i].id, gBuffOper[i].player, gBuffOper[i].value);
			} else {
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
	fightRecord.roundCount = round;
	return fightRecord;
}

function getRandom(length, num) {
	var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	if (length <= num) {
		return a.slice(0, length).reverse();
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
