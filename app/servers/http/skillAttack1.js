var playerAttri = require("./playerAttri");
var redisClient = require('../../dao/redis/redisClient');
NORMALATTACK = 1;
PHYSICALATTACK = 2;
SKILLATTACK = 3;

var time1 ;

exports.startBattle2 = function(fightStruct1, fightStruct2) {
    //打怪
    var INDEX_LEN = 11
    var fightTeam1 = [];
    var fightTeam2 = [];
    var buffsOper = [];
    fightRecords = {
        roundCount: 0,
        team1: [],
        team2: [],
        fightActions: [],
        buffs: []
    };
    for (var i in fightStruct1) {
        var j = {
            name: fightStruct1[i].name,
            maxHp: fightStruct1[i].maxHp,
            hp: fightStruct1[i].hp,
            pos: i
        };
        var fightAttri = new playerAttri.FightAttri(fightStruct1[i].fightAttri);
        fightAttri.pos = i;
        fightTeam1.push(fightAttri);
        fightRecords.team1.push(j);
    }
    var exptotal = 0;
    for (var i in fightStruct2) {
        var j = {
            name: fightStruct2[i].name,
            maxHp: fightStruct2[i].maxHp,
            hp: fightStruct2[i].hp,
            pos: i
        };

        var fightAttri = new playerAttri.FightAttri(fightStruct2[i].fightAttri);
        fightAttri.pos = i;
        fightTeam2.push(fightAttri);
        fightRecords.team2.push(j);
    }
    //战斗的队列
    aQueue1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    aQueue2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    //场上的队列
    pQueue1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    pQueue2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    //队列1长度
    pQueue1[10] = fightStruct1.length;
    //队列2长度
    pQueue2[10] = fightStruct2.length;
    var round = 0;

    while (pQueue1[10] > 0 && pQueue2[10] > 0) {
        aQueue1 = pQueue1.slice(0, 11);
        aQueue2 = pQueue2.slice(0, 11);
        getRandomByarray(aQueue1, 1);
        getRandomByarray(aQueue2, 1);
        while ((aQueue1[10] > 0 && pQueue2[10] > 0) || (aQueue2[10] > 0 && pQueue1[10] > 0)) {
            if (aQueue1[10] > 0 && pQueue2[10] > 0) {
                battling(aQueue1, pQueue1, pQueue2, fightTeam1, fightTeam2, fightRecords, buffsOper, round);
            }
            if (aQueue2[10] > 0 && pQueue1[10] > 0) {
                battling(aQueue2, pQueue2, pQueue1, fightTeam2, fightTeam1, fightRecords, buffsOper, round);
            }
        }

        //回合结束 计算buff
        var length = buffsOper.length;
        var buffs = [];
        /*
                for (var i = length - 1; i >= 0; i--) {
                    gBuffOper[i].tick--;
                    if (gBuffOper[i].tick === 0) {
                        buffOper(gBuffOper[i].id, gBuffOper[i].player, gBuffOper[i].value);
                        gBuffOper.splice(i, 1);
                    } else {
                        var buff = {
                            id: gBuffOper[i].id,
                            tick: gBuffOper[i].tick,
                            pos: gBuffOper[i].player.pos,
                            round: round
                        }
                        buffs.push(buff);
                    }
                }
                fightRecords.buffs.push(buffs);*/
        round++;
        if (pQueue2[10] === 0) {
            calcReward(exptotal, goods, fightStruct1, fightStruct2);
            break;
        }
    }
    fightRecords.roundCount = round;
    return fightRecords;
}

function battling(maQueue, mpQueue, dpQueue, mTeam, dTeam, fightRecords, buffsOper, round) {
    var defenderRecords = [];
    var skillId;
    while (maQueue[10] >= 0) {
        var index = maQueue[maQueue[10] - 1];
        maQueue[10] -= 1;
        var attacker = mTeam[index];
        if (attacker.hp > 0) {
            if (attacker.type === 1) {
                skillId = playerSkillAttack(attacker, maQueue, mpQueue, dpQueue, mTeam, dTeam, buffsOper, defenderRecords);
            } else {
                skillId = petSkillAttack(attacker, maQueue, mpQueue, dpQueue, mTeam, dTeam, buffsOper, defenderRecords);
            }
        } else if (attacker.battleStatus !== 1) {
            break;
        } else {
            continue;
        }
        var attackerRecord = {
            hp: attacker.hp,
            pos: attacker.pos,
            skillId: skillId,
            //player: new playerAttri.Player(attacker)
        };

        var fightAction = {
            round: round,
            attackerRecord: attackerRecord,
            defenderRecords: defenderRecords
        };
        fightRecords.fightActions.push(fightAction);
        break;
    }
};

function playerSkillAttack(attacker, maQueue, mpQueue, dpQueue, mTeam, dTeam, buffsOper, defenderRecords) {
    var opt = {
        damagePer: 0,
        avoidRate: 0,
        critRate: 0,
        critHurt: 0,
        vampirePer: 0,
        damage: 0,
        hitRate: 0,
        attack: 0,
        reduceDefendPer: 0,
        reduceDamagePer: 0
    }
    var skillId = attacker.skills[attacker.skillPos];
    //  console.log(attacker.name + '使用了技能' + skillId);
    switch (skillId) {
        case 0:
            //普通攻击：
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
            break;
        case 101000:
            //血性狂击。攻击敌人，并恢复伤害的20%的血量(物理)
            opt.vampirePer = 20;
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
            break;
        case 102000:
            //羽之守护:增加宠物的防御力，闪避率，回血速度buff
            if (attacker.pet) {
                attacker.pet.defend = attacker.pet.defend + 10;
                attacker.pet.recoverHp = attacker.pet.recoverHp + 10;
                attacker.pet.avoidRate = attacker.pet.avoidRate + 10;
                var buff = {
                    id: 102000,
                    tick: 3,
                    value: [10, 10, 10],
                    player: attacker.pet
                };
                buffOper.push(buff);
            } else {
                battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
            }
            break;
        case 103000:
            //兽王击。附加宠物的50%的攻击力，并给予敌人一击(物理)
            opt.attack = Math.floor(attacker.pet.attack * 0.5);
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
        case 104000:
            //狼嚎。增加宠物攻击力，暴击率，暴击伤害
            attacker.pet.attack = attacker.pet.attack + 10;
            attacker.pet.critRate = attacker.pet.critRate + 10;
            attacker.pet.critHurt = attacker.pet.critHurt + 10;
            var buff = {
                id: 104000,
                tick: 3,
                value: [10, 10, 10],
                player: attacker.pet
            };
            buffOper.push(buff);
            break;
        case 105000:
            //心灵相通。给自己和宠物恢复一定的血量。
            if (attacker.pet.hp > 0 && attacker.pet.status !== 1) {
                attacker.pet.hp = attacker.pet.hp + 100;
            }
            if (attacker.status !== 1) {
                attacker.hp = attacker.hp + 100;
            }
            break;
        case 106000:
            //自然之怒:攻击2-3人,伤害递减(技能)
            battle2(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, opt, function(p, popt) {
                popt.reduceDamagePer = -10;
            }, 3);
            break;
        case 107000:
            //弈剑回风：暴击率提升10%对单个敌人施展物理攻击(物理)
            opt.critRate = 10;
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
            break;
        case 108000:
            //招魂术,复活自己的宠物
            if (attacker.pet.hp > 0) {
                battle1(attacker, dpQueue, dTeam, defenderRecords, NORMALATTACK, opt);
            } else {
                attacker.pet.hp = attacker.pet.maxHp * 0.1;
                playerQueue.push(attacker.pet);
            }
            break;
        case 201000:
            //烽火连天 连续攻击单个敌人2次。(物理)
            battle2(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, opt, null, 2);
            break;
        case 202000:
            //鬼舞斩杀：100%暴击(物理)
            opt.critRate = 1000;
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
            break;
        case 203000:
            //箭雨:攻击2-3人(物理)
            battle2(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, {}, 3);
            break;
        case 204000:
            //腐蚀之箭：使武器带上腐蚀的buff。buff持续3回合(物理)
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt, function(p, popt) {
                p.defend = p.defend - 10;
                var buff = {
                    id: 203000,
                    tick: 3,
                    value: [-10],
                    player: p
                };
                buffOper.push(buff);
            });
            break;
        case 205000:
            //破血狂攻：无视敌人10%护甲，伤害增加30%，暴击率提升30%(物理)
            opt.damageRate = 30;
            opt.critRate = 30;
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt, function(p, popt) {
                popt.reduceDefend = p.defend * 0.1
            });
            break;
        case 206000:
            //炼魂：提升命中率，暴击率，暴击伤害，buff
            attacker.hitRate = attacker.hitRate + 10;
            attacker.critRate = attacker.critRate + 10;
            attacker.critHurt = attacker.critHurt + 10;
            var buff = {
                id: 206000,
                tick: 3,
                value: [10, 10, 10],
                player: attacker
            };
            buffOper.push(buff);
            break;
        case 207000:
            //凝风斩：对单个敌人施展攻击(技能)
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
            break;
        case 208000:
            //箭芒：攻击2-3人,伤害递减(技能)
            battle2(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, opt, function(p, popt) {
                popt.reduceDamagePer = -10;
            }, 2);
            break;
        case 301000:
            //点穴封脉: 使单个敌人在一定回合内无法恢复生命。
            var index = Math.floor(Math.random() * defendQueue.length);
            defendQueue[index].status = 1;
            var buff = {
                id: 301000,
                tick: 3,
                player: defendQueue[index]
            };
            buffOper.push(buff);
            break;
        case 302000:
            //圣元回天：复活单个死亡的队友。
            break;
        case 303000:
            //星辰变:使多个敌人生命受到固定伤害。可攻击的敌人数随心法等级增加。(技能)
            opt = {
                damage: 100
            }
            battle2(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, opt, 3);
            break;
        case 304000:
            //沛雨甘霖：为多个队友持续恢复生命。可作用的队友数随心法等级增加。
            var k = getRandom(adlen, 3);
            for (var i = 0; i < num; i++) {
                var p = atmp[adqueue[k[num]]];
                var buff = {
                    id: 304000,
                    tick: 3,
                    value: [50],
                    player: p
                };
                buffOper.push(buff);
                if (p.status !== 1) {
                    p.hp = p.hp + 50;
                }
            }
            break;
        case 305000:
            //清风如穆: 对多个敌人施展物理攻击，可攻击的敌人数随心法等级增加。该技能只能对怪物使用。(物理)
            battle2(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt, 3);
        case 306000:
            //回风拂柳: 对单个敌人进行连续两次的物理攻击(物理)
            battle3(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, {}, 2);
        case 307000:
            //去腐生肌: 回复单个队友的血量
            var index = Math.floor(Math.random() * adlen);
            var p = atmp[adqueue[index]];
            if (p.status !== 1) {
                p.hp = p.hp + 150;
            }
            break;
        case 308000:
            //炽热光环，为队友提供一个20%减伤护盾，护盾持续3回合
            var k = getRandom(adlen, 3);
            for (var i = 0; i < num; i++) {
                var p = atmp[adqueue[k[num]]];
                p.reduceDamagePer = p.reduceDamagePer + 20;
                var buff = {
                    id: 308000,
                    tick: 3,
                    value: [20],
                    player: p
                };
                buffOper.push(buff);
            }
            break;
        case 401000:
            //舍我其谁：附加失去血量的百分比伤害
            opt = {
                damageRate: (1 - attacker.hp / attacker.maxHp)
            }
            battle1(attacker, defendQueue, defenderRecords, PHYSICALATTACK, opt);
            break;
        case 402000:
            //狂暴旋风: 攻击所有敌人，伤害递减(技能)
            opt.damageRate = -20
            battle2(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, opt, defendQueue.length, function(p, popt) {
                opt = {
                    damageRate: opt.damageRate - 15
                }
            });
            break;
        case 403000:
            //孤注一掷：伤害增加30%
            opt.damageRate + 30;
            battle1(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, opt);
            break;
        case 404000:
            //暴怒：提升自身的攻击力和防御力
            attacker.attack = attacker.attack + 10;
            attacker.defend = attacker.defend + 10;
            var buff = {
                id: 404000,
                tick: 3,
                value: [10, 10],
                player: attacker
            };
            buffOper.push(buff);
        case 405000:
            //冲撞：附加额外伤害，并一定概率击晕敌人，使敌人无法行动一回合
            opt.damageRate = 30
            battle1(player, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt, function(p) {
                p.battleStatus = 1; //眩晕，昏睡，
                var buff = {
                    id: 405000,
                    tick: 2,
                    player: p
                };
                buffOper.push(buff);
            });
            break;
        case 406000:
            //龙啸九天：攻击3个敌人
            battle2(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt, 3);
            break;
        case 407000:
            //嗜血狂袭
            opt.vampirePer = 20;
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
            break;
        default:
            //普通攻击：
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
            break;
    }

    // attacker.skillPos = attacker.skillPos === 3 ? 1 : attacker.skillPos + 1;
    return skillId;
}

function petSkillAttack(attacker, maQueue, mpQueue, dpQueue, mTeam, dTeam, buffsOper, defenderRecords) {
    var opt = {
        damagePer: 0,
        avoidRate: 0,
        critRate: 0,
        critHurt: 0,
        vampirePer: 0,
        damage: 0,
        hitRate: 0,
        attack: 0,
        reduceDefendPer: 0,
        reduceDamagePer: 0
    };
    var skillId = attacker.skills[0];
    // console.log(attacker.name + '使用了技能' + skillId);
    switch (skillId) {
        case 0:
            //普通攻击：
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
            break;
        case 111000:
            //寒水：
            battle1(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, opt);
            break;
        case 112000:
            //岩裂：
            battle1(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, opt);
            break;
        case 113000:
            //啸风：攻击2个敌人。(技能)
            battle2(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, opt, function(p, popt) {
                popt.reduceDamagePer = -10;
            }, 2);
            break;
        case 114000:
            //风起云涌：攻击3个敌人。(技能)
            battle2(attacker, dpQueue, dTeam, defenderRecords, SKILLATTACK, opt, function(p, popt) {
                popt.reduceDamagePer = -10;
            }, 3);
            break;
        case 115000:
            //奕剑四方：攻击2个敌人。(物理)
            battle2(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt, function(p, popt) {
                popt.reduceDamagePer = -10;
            }, 2);
            break;
        case 116000:
            //奕剑八方：攻击3个敌人。(物理)
            battle2(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt, function(p, popt) {
                popt.reduceDamagePer = -10;
            }, 3);
            break;
        default:
            //普通攻击：
            battle1(attacker, dpQueue, dTeam, defenderRecords, PHYSICALATTACK, opt);
            break;
    }
    return skillId;
}

function buffOper(id, player, value) {
    switch (id) {
        case 102000:
            //增加宠物的防御力，闪避率，回血速度buff
            player.defend -= value[0];
            player.recoverHp -= value[1];
            player.avoidRate -= value[2];
            break;
        case 104000:
            //狼嚎。增加宠物攻击力，暴击率，暴击伤害
            player.attack -= value[0];
            player.critRate -= value[1];
            player.critHurt -= value[2];
            break;
        case 203000:
            //腐蚀之箭：使武器带上腐蚀的buff。buff持续3回合
            player.defend -= value[0];
            break;
        case 206000:
            //炼魂：提升命中率，暴击率，暴击伤害，buff
            player.hitRate -= value[0];
            player.critRate -= value[1];
            player.critHurt -= value[2];
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
            player.reduceDamagePer -= value[0];
            break;
        case 404000:
            //暴怒：提升自身的攻击力和防御力
            player.attack -= value[0];
            player.defend -= value[1];
            break;
        case 405000:
            //冲撞：附加额外伤害，并一定概率击晕敌人，使敌人无法行动一回合
            player.battleStatus = 1;
            break;
    }
}

function battle1(attacker, dpQueue, dTeam, defenderRecords, attackType, opt, func) {
    var oper = {
        reacOper: 0,
        vampireHurt: 0,
        damage: 0
    };
    var index = Math.floor(Math.random() * dpQueue[10]);
    var p = dTeam[index];
    if (func) {
        func(p, opt);
    }
    calcSkilldamage(attacker, p, attackType, oper, opt);

    defenderRecord = {
        hp: p.hp,
        oper: oper,
        pos: p.pos,
        //player: new playerAttri.Player(p)
    };
    defenderRecords.push(defenderRecord);
    if (p.hp <= 0) {
        dpQueue[10] -= 1;
        dpQueue[index] = dpQueue[dpQueue[10]];
    }
}

function battle2(attacker, dpQueue, dTeam, defenderRecords, attackType, opt, func, num) {
    var k = getRandom(dpQueue[10], num);
    var oper = {
        reacOper: 0,
        vampireHurt: 0,
        damage: 0
    };
    var l = k.length;
    for (var i = 0; i < l; i++) {
        var p = dTeam[k[i]];
        if (func) {
            func(p, opt);
        }
        calcSkilldamage(attacker, p, attackType, oper, opt);
        defenderRecord = {
            hp: p.hp,
            pos: p.pos,
            oper: oper,
            //player: new playerAttri.Player(p)
        };
        defenderRecords.push(defenderRecord);
        if (p.hp <= 0) {
            dpQueue[10] -= 1;
            dpQueue[index] = dpQueue[dpQueue[10]];
        }
    }
}

function battle3(attacker, dpQueue, dTeam, defenderRecords, attackType, opt, func, times) {
    var oper = {
        reacOper: 0,
        vampireHurt: 0,
        damage: 0
    };
    var index = Math.floor(Math.random() * dpQueue[10]);
    var p = dTeam[index];
    for (var i = 0; i < times; i++) {
        if (func) {
            func(p, opt);
        }
        calcSkilldamage(attacker, p, attackType, oper, opt);
        defenderRecord = {
            hp: p.hp,
            oper: oper,
            pos: p.pos
                //player: new playerAttri.Player(p)
        };
        defenderRecords.push(defenderRecord);
        if (p.hp <= 0) {
            dpQueue[10] -= 1;
            dpQueue[index] = dpQueue[dpQueue[10]];
            break;
        }
    }
}

//计算技能伤害
function calcSkilldamage(attacker, defender, attackType, oper, opt) {

    if (opt.damage > 0) {
        //固定伤害
        defender.hp = damage = defender.hp - damage;
        oper.damage = opt.damage;
        // console.log(defender.name + '受到' + attacker.name + '的' + opt.damage + '固定伤害—(' + attacker.name + '的hp:' + attacker.hp + ';' + defender.name + '的hp:' + defender.hp + ')');
        return;
    }
    var damage = 0;
    var damagePer = 100;
    var content = '';
    if (attackType !== 3) {
        //是否闪避
        var rate = defender.avoidRate - opt.hitRate - attacker.hitRate;
        rate = rate < 0 ? 10 : (rate > 80 ? 80 : rate);
        if (Math.floor(Math.random() * 100) <= rate) {
            oper.reacOper = 2;
            // console.log(defender.name + '闪避了' + attacker.name + '的攻击——————(' + attacker.name + '的hp:' + attacker.hp + ';' + defender.name + '的hp:' + defender.hp + ')');
            return;
        }
    }
    if (attackType !== 3) {
        //是否暴击
        rate = attacker.critRate + opt.critRate - defender.toughnessRate;
        if (Math.floor(Math.random() * 100) <= rate) {
            oper.reacOper = 1;
            damagePer = damagePer + attacker.critHurt + opt.critHurt;
        }
    }
    //计算伤害
    damage = attacker.attack + opt.attack - defender.defend + defender.defend * opt.reduceDefendPer / 100;
    if (damage < 0) {
        oper.damage = 0;
        //  console.log(defender.name + '受到' + attacker.name + '的' + oper.damage + '伤害——————(' + attacker.name + '的hp:' + attacker.hp + ';' + defender.name + '的hp:' + defender.hp + ')');
        return;
    }
    oper.damage = Math.floor(damage * (damagePer + opt.damagePer - defender.reduceDamagePer - opt.reduceDamagePer) / 100);
    defender.hp = defender.hp - oper.damage;
    if (attacker.vampirePer > 0 && attackType !== 3 && attacker.status !== 1) {
        hp = attacker.hp + oper.damage * attacker.vampirePer / 100;
        oper.vampireHurt = hp < attacker.maxHp ? hp : attacker.maxHp;
        attacker.hp = attacker.hp + oper.vampireHurt;
    }
    // console.log(defender.name + '受到' + attacker.name + '的' + oper.damage + '伤害——————(' + attacker.name + '的hp:' + attacker.hp + ';' + defender.name + '的hp:' + defender.hp + ')');
    return;
};

//计算胜利后的奖励
function calcReward(fightStruct1, fightStruct2, fightRecords) {
    results = [];
    var exptotal = 0;
    var money = 0;
    var goods = [];
    var length = fightStruct1.length;
    for (var i in fightStruct2) {
        exptotal += fightStruct2[i].exp;
        money += fightStruct2[i].money;
        goods = goods.concat(fightStruct2[i].goods);
    }
    for (var i in fightStruct1) {
        fightStruct1[i].exp += Math.floor(exptotal / length);;
        fightStruct1[i].money += Math.floor(money / length);
        
        addgoods(fightStruct1[i].bagId,goods);
        var result = {
            pos: fightStruct1[i].pos,
            exp: exp,
            money: money,
            goods : goods
        }
        results.push(result);
    }
    fightRecords.results = results;
}

function addgoods(bagId, goods){
    for(var i in goods){
            redisClient.zincrby(bagId, goods[i], 1);
    }
    
}
function getRandom(length, num) {
    var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (length <= num) {
        num = length;
    }
    var len = length;
    for (var i = 0; i < num; i++) {
        var j = Math.floor(Math.random() * len);
        len -= 1;
        a[j] = a[len];
    }
    return a.slice(length - num, num).reverse();
}

function getRandomByarray(array, num) {
    var len = num;
    for (var i = 0; i < num; i++) {
        var j = Math.floor(Math.random() * len);
        len -= 1;
        array[j] = array[len];
    }
}

function getRandomValue(min, max) {
    var a1 = max - min;
    var a2 = a1 + 1;
    var a3 = Math.floor(Math.random() * a2) + Math.floor(Math.random() * a2);
    if (a3 > a1) {
        a3 = 2 * a1 - a3;
    }
    return max - a3;
}