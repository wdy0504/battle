var pomelo = window.pomelo;
var phoneNumber;
var password;
//var ip = "127.0.0.1";
var ip = window.location.hostname;
var port = "8001";
var base = 1000;
var increase = 25;
//add message on board
function postfunc(route, args, callback) {
	var url = "http://" + ip + ":" + port + "/" + route;
	$.post(url, args, function(data, status) {
		callback(data);
	}, "json");
}

function battle() {
	var route = "battle/battle";
	postfunc(route, null, function(data) {
		console.log(data);
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
			content = fightAction.attackerRecord.name + "使用了技能" + fightAction.attackerRecord.skillId ;
			if (fightAction.attackerRecord.pos > 10) {
				$('.battle').append('<p  align="right">' + content + '</p>');
			} else {
				$('.battle').append('<p  align="left">' + content + '</p>');
			}
			for(var k = 0; k<fightAction.defenderRecords.length; k++){
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
			for(var k = 0; k< data.queue1.length; k++){
				addAttri(data.queue1[k])
			}
			for(var k = 0; k< data.queue2.length; k++){
				addAttri(data.queue2[k])
			}
			function addAttri(queue){
				var p = queue;
				var content = '';
				content = content + '<p  align="left">' + '攻击力:'+ p.fightAttri.attack + '</p>';
				content = content + '<p  align="left">' + '闪避:'+ p.fightAttri.avoid + '</p>';
				content = content + '<p  align="left">' + '控制:'+ p.fightAttri.control + '</p>';
				content = content + '<p  align="left">' + '暴击:'+ p.fightAttri.crit + '</p>';
				content = content + '<p  align="left">' + '暴击伤害:'+ p.fightAttri.critHurt + '</p>';
				content = content + '<p  align="left">' + '防御:'+ p.fightAttri.defend + '</p>';
				content = content + '<p  align="left">' + '命中:'+ p.fightAttri.hit + '</p>';
				content = content + '<p  align="left">' + '回血:'+ p.fightAttri.recoverHp + '</p>';
				content = content + '<p  align="left">' + '伤害减免:'+ p.fightAttri.reduceDamagePer + '</p>';
				content = content + '<p  align="left">' + '防御减免:'+ p.fightAttri.reduceDefend + '</p>';
				content = content + '<p  align="left">' + '防御减免百分比:'+ p.fightAttri.reduceDefendPer + '</p>';
				content = content + '<p  align="left">' + '物理防御减免百分比:'+ p.fightAttri.reducePhysicalDamagePer + '</p>';
				content = content + '<p  align="left">' + '技能防御减免百分比:'+ p.fightAttri.reduceSkillDamagePer + '</p>';
				content = content + '<p  align="left">' + '抗性:'+ p.fightAttri.resistance + '</p>';
				content = content + '<p  align="left">' + '韧性:'+ p.fightAttri.toughness + '</p>';
				content = content + '<p  align="left">' + '吸血百分比:'+ p.fightAttri.vampirePer + '</p>';
				$('.attri').append('<div class="con3">' + content + '</div>');
			}
		}
	});
}
$(document).ready(function() {
	$("#battle").click(function() {
		battle();
	});
});