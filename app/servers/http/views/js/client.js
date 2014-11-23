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
	});
}
$(document).ready(function() {
	$("#battle").click(function() {
		battle();
	});
});