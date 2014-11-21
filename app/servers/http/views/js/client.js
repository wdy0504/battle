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

		$('#name1').text(data.attack.one.name);
		$('#hp1').text(data.attack.one.hp);
		
		$('#name2').text(data.attack.two.name);
		$('#hp2').text(data.attack.two.hp);
		
		$('#name11').text(data.defend.one.name);
		$('#hp11').text(data.defend.one.hp);
	
		$('#name12').text(data.defend.two.name);
		$('#hp12').text(data.defend.two.hp);
	
		var length = data.fightActions.length;
		var i = 0;
		battling();

		function battling() {
			var fightAction = data.fightActions[i];
			i++;
			var content = '';

			if (fightAction.defenders[0].reacOper1 === 2) {
				content = content + fightAction.defenders[0].player.name + "闪避了" + fightAction.attacker.player.name + "的攻击。";
				if (fightAction.defenders[0].player.pos > 10) {
					$('.battle').append('<p  align="right">' + content + '</p>');
				} else {
					$('.battle').append('<p  align="left">' + content + '</p>');
				}
				if (i < length) {
					setTimeout(battling, 300);
				}
				return;
			}
			if (fightAction.defenders[0].reacOper1 === 1) {
				content = fightAction.defenders[0].player.name + "格挡了" + fightAction.attacker.player.name + "的攻击。<br/>";
			}
			var critContent = fightAction.defenders[0].reacOper2 === 1 ? "暴击" : "";
			content = content + fightAction.defenders[0].player.name + "受到了" + fightAction.attacker.player.name + "的" + fightAction.defenders[0].damage + critContent + "伤害";
			$('#hp' + fightAction.defenders[0].player.pos).text(fightAction.defenders[0].player.hp);

			if (fightAction.defenders[0].player.pos > 10) {
				$('.battle').append('<p  align="right">' + content + '</p>');
			} else {
				$('.battle').append('<p  align="left">' + content + '</p>');
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