var pomelo = window.pomelo;
var phoneNumber;
var password;
//var ip = "127.0.0.1";
var ip = window.location.hostname;
var port = "8001";
var base = 1000;
var increase = 25;
//add message on board
var DATA = '';
var index = 0;
function postfunc(route, args, callback) {
	var url = "http://" + ip + ":" + port + "/" + route;
	$.post(url, args, function (data, status) {
		callback(data);
	}, "json");
}

function battle() {
	var route = "battle/battle";
	postfunc(route, null, function (data) {
		console.log(data);
		DATA = data;
		$('#name1').text(data.queue1[0].name);
		$('#hp1').text(data.queue1[0].hp);

		$('#name2').text(data.queue1[1].name);
		$('#hp2').text(data.queue1[1].hp);

		$('#name11').text(data.queue2[0].name);
		$('#hp11').text(data.queue2[0].hp);

		$('#name12').text(data.queue2[1].name);
		$('#hp12').text(data.queue2[1].hp);

		var length = data.fightActions.length;
		var i = 0;

		playerAttri();

		battling();

		function battling() {
			var fightAction = data.fightActions[i];
			i++;
			var content = '';
			content = fightAction.attackerRecord.name + "使用了技能" + fightAction.attackerRecord.skillId;
			if (fightAction.attackerRecord.pos > 10) {
				$('.battle').append('<p  align="right">' + content + '</p>');
			} else {
				$('.battle').append('<p  align="left">' + content + '</p>');
			}
			for (var k = 0; k < fightAction.defenderRecords.length; k++) {
				if (fightAction.defenderRecords[k].oper.reacOper === 2) {
					content = fightAction.defenderRecords[k].name + "闪避了" + fightAction.attackerRecord.name + "的攻击。";
					if (fightAction.defenderRecords[k].pos > 10) {
						$('.battle').append('<p  align="right">' + content + '</p>');
					} else {
						$('.battle').append('<p  align="left">' + content + '</p>');
					}
					continue;
				}

				var critContent = fightAction.defenderRecords[k].oper.reacOper === 1 ? "暴击" : "";
				content = fightAction.defenderRecords[k].name + "受到了" + fightAction.attackerRecord.name + "的" + fightAction.defenderRecords[k].oper.damage + critContent + "伤害";
				$('#hp' + fightAction.defenderRecords[k].pos).text(fightAction.defenderRecords[k].hp);

				if (fightAction.defenderRecords[k].pos > 10) {
					$('.battle').append('<p  align="right">' + content + '</p>');
				} else {
					$('.battle').append('<p  align="left">' + content + '</p>');
				}
			}

			if (i < length) {
				setTimeout(battling, 300);
			}
		}

		function playerAttri() {
			for (var k = 0; k < data.queue1.length; k++) {
				addAttri(data.queue1[k]);
			}
			for (var k = 0; k < data.queue2.length; k++) {
				addAttri(data.queue2[k]);
			}
			function addAttri(queue) {
				var p = queue;
				var content = '';
				content = content + '<p  align="left">' + '攻击力:' + p.fightAttri.attack + '</p>';
				content = content + '<p  align="left">' + '闪避:' + p.fightAttri.avoid + '</p>';
				content = content + '<p  align="left">' + '控制:' + p.fightAttri.control + '</p>';
				content = content + '<p  align="left">' + '暴击:' + p.fightAttri.crit + '</p>';
				content = content + '<p  align="left">' + '暴击伤害:' + p.fightAttri.critHurt + '</p>';
				content = content + '<p  align="left">' + '防御:' + p.fightAttri.defend + '</p>';
				content = content + '<p  align="left">' + '命中:' + p.fightAttri.hit + '</p>';
				content = content + '<p  align="left">' + '回血:' + p.fightAttri.recoverHp + '</p>';
				content = content + '<p  align="left">' + '伤害减免:' + p.fightAttri.reduceDamagePer + '</p>';
				content = content + '<p  align="left">' + '防御减免:' + p.fightAttri.reduceDefend + '</p>';
				content = content + '<p  align="left">' + '防御减免百分比:' + p.fightAttri.reduceDefendPer + '</p>';
				content = content + '<p  align="left">' + '物理防御减免百分比:' + p.fightAttri.reducePhysicalDamagePer + '</p>';
				content = content + '<p  align="left">' + '技能防御减免百分比:' + p.fightAttri.reduceSkillDamagePer + '</p>';
				content = content + '<p  align="left">' + '抗性:' + p.fightAttri.resistance + '</p>';
				content = content + '<p  align="left">' + '韧性:' + p.fightAttri.toughness + '</p>';
				content = content + '<p  align="left">' + '吸血百分比:' + p.fightAttri.vampirePer + '</p>';
				$('.attri').append('<div class="con3">' + content + '</div>');
			}
		}
	});
}
function next() {
	if (DATA) {
		if (index >= DATA.fightActions.length - 1) {
			return
		}
		index += 1;
		var data = DATA.fightActions[index];
		$('#round').text('第' + data.round + '回合' + index);
		$('.data').empty();
		if (data.round !== 0) {
			addBuff(DATA.buffs[data.round - 1]);
		}
		addAttri(data.attackerRecord);
		for (var k = 0; k < data.defenderRecords.length; k++) {
			addAttri(data.defenderRecords[k]);
		}

	}

}
function prev() {
	if (DATA) {
		if (index <= 0) {
			return
		}
		index -= 1;
		var data = DATA.fightActions[index];
		$('#round').text('第' + data.round + '回合' + index);
		$('.data').empty()
		if (data.round !== 0) {
			addBuff(DATA.buffs[data.round - 1]);
		}
		addAttri(data.attackerRecord);
		for (var k = 0; k < data.defenderRecords.length; k++) {
			addAttri(data.defenderRecords[k]);
		}

	}
}

function addAttri(record) {
	var p = record;
	var content = '';
	if (p.skillId) {
		content = content + '<p  align="left">' + 'skillId:' + p.skillId + '</p>';
	}
	content = content + '<p  align="left">' + 'hp:' + p.hp + '</p>';
	content = content + '<p  align="left">' + 'pos:' + p.hp + '</p>';
	content = content + '<p  align="left">' + 'name:' + p.name + '</p>';
	if (p.oper) {
		content = content + '<p  align="left">' + 'damage:' + p.oper.damage + '</p>';
		content = content + '<p  align="left">' + 'reacOper:' + p.oper.reacOper + '</p>';
		content = content + '<p  align="left">' + 'vampireHurt:' + p.oper.vampireHurt + '</p>';
	}
	content = content + '<p  align="left">' + '攻击力:' + p.player.fightAttri.attack + '</p>';
	content = content + '<p  align="left">' + '闪避:' + p.player.fightAttri.avoid + '</p>';
	content = content + '<p  align="left">' + '控制:' + p.player.fightAttri.control + '</p>';
	content = content + '<p  align="left">' + '暴击:' + p.player.fightAttri.crit + '</p>';
	content = content + '<p  align="left">' + '暴击伤害:' + p.player.fightAttri.critHurt + '</p>';
	content = content + '<p  align="left">' + '防御:' + p.player.fightAttri.defend + '</p>';
	content = content + '<p  align="left">' + '命中:' + p.player.fightAttri.hit + '</p>';
	content = content + '<p  align="left">' + '回血:' + p.player.fightAttri.recoverHp + '</p>';
	content = content + '<p  align="left">' + '伤害减免:' + p.player.fightAttri.reduceDamagePer + '</p>';
	content = content + '<p  align="left">' + '防御减免:' + p.player.fightAttri.reduceDefend + '</p>';
	content = content + '<p  align="left">' + '防御减免百分比:' + p.player.fightAttri.reduceDefendPer + '</p>';
	content = content + '<p  align="left">' + '物理防御减免百分比:' + p.player.fightAttri.reducePhysicalDamagePer + '</p>';
	content = content + '<p  align="left">' + '技能防御减免百分比:' + p.player.fightAttri.reduceSkillDamagePer + '</p>';
	content = content + '<p  align="left">' + '抗性:' + p.player.fightAttri.resistance + '</p>';
	content = content + '<p  align="left">' + '韧性:' + p.player.fightAttri.toughness + '</p>';
	content = content + '<p  align="left">' + '吸血百分比:' + p.player.fightAttri.vampirePer + '</p>';
	$('.data').append('<div class="con4">' + content + '</div>');
};

function addBuff(buff) {
	var content = '';
	for (var k = 0; k < buff.length; k++) {
		content = content + '<p  align="left">' + 'id:' + buff[k].id + '</p>';
		content = content + '<p  align="left">' + 'pos:' + buff[k].pos + '</p>';
		content = content + '<p  align="left">' + 'tick:' + buff[k].tick + '</p>';
	}
	$('.data').append('<div class="con4">' + content + '</div>');
};
function addplayer1() {
	console.log('addplayer1');
	var basicAttri = {
		attack : 80,
		defend : 50,
		critHurt : 50,
		crit : 150,
		toughness : 50,
		hit : 50,
		avoid : 50
	};
	var player = {
		name : '狗',
		type : 2,
		basicAttri : basicAttri,
		fightAttri : {},
		attriRate : {},
		hp : 200,
		maxHp : 200,
		skills : [101000, 0, 106000, 107000]
	}
	var route = "battle/addPlay1";
	var args = {
		player: JSON.stringify(player)
	}
	postfunc(route, args, function (data) {});
}
function addplayer2() {}

$(document).ready(function () {
	$("#battle").click(function () {
		battle();
	});

	$("#next").click(function () {
		next();
	});

	$("#prev").click(function () {
		prev();
	});

	$("#addplayer1").click(function () {
		addplayer1();
	});

	$("#addplayer2").click(function () {
		addplayer2();
	});

});
