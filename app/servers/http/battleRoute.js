//var redisClient = require('../../../models/redisClient');


var skillAttack = require("./skillAttack");
var playerAttri = require("./playerAttri");

var  gfightStruct1 = [];
var  gfightStruct2 = [];
module.exports = function (app) {
	app.post('/battle/battle', function (req, res) {
		var b = battle();
		res.send(b);
	});
	
	app.post('/battle/addPlay1', function (req, res) {
		var data = req.body.player
		JSON.parse(data);
		var player = new playerAttri.Player(data);
		gfightStruct1.push(player)
		res.send('sucess');
	});
	app.post('/battle/addPlay2', function (req, res) {
		var data = req.body.player
		JSON.parse(data);
		var player = new playerAttri.Player(data);
		gfightStruct1.push(player)
		res.send('sucess');
	});
	
	app.post('/battle/getPlay1', function (req, res) {
		res.send(gfightStruct1);
	});
	
	app.post('/battle/getPlay2', function (req, res) {
		res.send(gfightStruct2);
	});
	
	app.post('/battle/lvlup',function(req, res){
		var index = req.body.index;
		index = parseInt(index);
		skillAttack.lvlup(gfightStruct1[index]);
		res.send(gfightStruct1[index]);
	})
	
	app.post('/battle/battle',function(req, res){
		res.send( skillAttack.startBattle(gfightStruct1, gfightStruct2) );
	})
}

function battle() {
	var basicAttri = {
			attack : 80,
			defend : 50,
			critHurt : 50,
			crit : 150,
			toughness : 50,
			hit : 50,
			avoid : 50
		};
	var pet1 = new playerAttri.Player({
			name : '狗',
			type : 2,
			basicAttri : basicAttri,
			fightAttri : {},
			attriRate : {},
			hp : 200,
			maxHp : 200,
			skills : [101000,0,106000,107000]
		});
	playerAttri.calcPlayer(pet1);
	
	var basicAttri = {
			attack : 60,
			defend : 50,
			critHurt : 50,
			crit : 150,
			toughness : 50,
			hit : 50,
			avoid : 50
		};
	var player1 = new playerAttri.Player({
			name : '韩立',
			type : 1,
			basicAttri : basicAttri,
			fightAttri : {},
			attriRate : {},
			hp : 200,
			maxHp : 200,
			pet : pet1,
			skills : [101000,102000,103000,104000]
		});
	playerAttri.calcPlayer(player1);
	
	var basicAttri = {
			attack : 60,
			defend : 50,
			critHurt : 50,
			crit : 150,
			toughness : 50,
			hit : 50,
			avoid : 50
		};
	var pet2 = new playerAttri.Player({
			name : '猫',
			type : 2,
			basicAttri : basicAttri,
			fightAttri : {},
			attriRate : {},
			hp : 200,
			maxHp : 200,
			skills : [101000,0,106000,107000]
		});
	playerAttri.calcPlayer(pet2);
	
	var basicAttri = {
			attack : 70,
			defend : 50,
			critHurt : 50,
			crit : 150,
			toughness : 50,
			hit : 50,
			avoid : 50
		};
	var player2 = new playerAttri.Player({
			name : '王林',
			type : 1,
			basicAttri : basicAttri,
			fightAttri : {},
			attriRate : {},
			hp : 200,
			maxHp : 200,
			pet : pet2,
			skills : [101000,102000,103000,104000]
		});
	playerAttri.calcPlayer(player2);

	player1.pos = 1;
	pet1.pos = 2;
	player2.pos = 11;
	pet2.pos = 12;

	var fightStructTmp1 = [];
	var pet = new playerAttri.Player(pet1);
	var player = new playerAttri.Player(player1);
	player.pet = pet;
	fightStructTmp1.push(player);
	fightStructTmp1.push(pet);
	
	
	var fightStructTmp2 = [];
	var pet = new playerAttri.Player(pet2);
	var player = new playerAttri.Player(player2);
	player.pet = pet;
	fightStructTmp2.push(player);
	fightStructTmp2.push(pet);

	//开始战斗
	return skillAttack.startBattle(fightStructTmp1, fightStructTmp2);
};
