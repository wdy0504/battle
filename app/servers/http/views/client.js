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

function battle(route) {
    postfunc(route, null, function (data) {
        console.log(data);
        DATA = data;

        for (var i = 0; i < data.queue1.length; i++) {
            var str = '';
            var k = Math.floor(i / 2);
            if (i % 2 === 0) {
                str = '玩家' + (k + 1) + '名字 : <span id="name' + (i + 1) + '">' + data.queue1[i].name + '</span><br/>';
            } else {
                str = '玩家' + (k + 1) + '宠物名字 : <span id="name' + (i + 1) + '">' + data.queue1[i].name + '</span><br/>';
            }
            str += 'hp： <span id="hp' + (i + 1) + '">' + data.queue1[i].hp + '</span><br/>';
            $('.p1').append(str);
        }

        for (var i = 0; i < data.queue2.length; i++) {
            var str = '';
            var k = Math.floor(i / 2);
            if (i % 2 === 0) {
                var str = '玩家' + (k + 1) + '名字 : <span id="name1' + (i + 1) + '">' + data.queue2[i].name + '</span><br/>';
            } else {
                var str = '玩家' + (k + 1) + '宠物名字 : <span id="name1' + (i + 1) + '">' + data.queue2[i].name + '</span><br/>';
            }
            str += 'hp： <span id="hp1' + (i + 1) + '">' + data.queue2[i].hp + '</span><br/>';
            $('.p2').append(str);
        }
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
                $('.battle').prepend('<p  align="right">' + content + '</p>');
            } else {
                $('.battle').prepend('<p  align="left">' + content + '</p>');
            }
            for (var k = 0; k < fightAction.defenderRecords.length; k++) {
                if (fightAction.defenderRecords[k].oper.reacOper === 2) {
                    content = fightAction.defenderRecords[k].name + "闪避了" + fightAction.attackerRecord.name + "的攻击。";
                    if (fightAction.defenderRecords[k].pos > 10) {
                        $('.battle').prepend('<p  align="right">' + content + '</p>');
                    } else {
                        $('.battle').prepend('<p  align="left">' + content + '</p>');
                    }
                    continue;
                }
                var critContent = fightAction.defenderRecords[k].oper.reacOper === 1 ? "暴击" : "";
                content = fightAction.defenderRecords[k].name + "受到了" + fightAction.attackerRecord.name + "的" + fightAction.defenderRecords[k].oper.damage + critContent + "伤害";
                $('#hp' + fightAction.defenderRecords[k].pos).text(fightAction.defenderRecords[k].hp);

                if (fightAction.defenderRecords[k].pos > 10) {
                    $('.battle').prepend('<p  align="right">' + content + '</p>');
                } else {
                    $('.battle').prepend('<p  align="left">' + content + '</p>');
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
        content = content + '<p align="left">攻击者</p>';
        content = content + '<p align="left">' + 'skillId:' + p.skillId + '</p>';
    } else {
        content = content + '<p align="left">防御者</p>';
    }
    content = content + '<p  align="left">' + 'hp:' + p.hp + '</p>';
    content = content + '<p  align="left">' + 'pos:' + p.pos + '</p>';
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
    content = content + '<p align="left">buff</p>';
    for (var k = 0; k < buff.length; k++) {
        content = content + '<p align="left">' + 'id:' + buff[k].id + '</p>';
        content = content + '<p align="left">' + 'pos:' + buff[k].pos + '</p>';
        content = content + '<p align="left">' + 'tick:' + buff[k].tick + '</p>';
    }
    $('.data').append('<div class="con4">' + content + '</div>');
};
function addplayer1() {
    addplayer(1)
}
function addplayer2() {
    addplayer(2)
}

function addplayer(index){
    var basicAttri = {};
    $('#playerBasicAttri').find("input").each(function () {
        if ($(this).attr('name')) {
            if (/^\d{1,10}$/.test($(this).val())) {
                basicAttri[$(this).attr('name')] = parseInt($(this).val());
            } else {
                basicAttri[$(this).attr('name')] = 0;
            }
        }
    });
    var name = $('#player #name').val();
    var maxHp = $('#player #maxHp').val();
    var skills = [];
    $("#player select").each(function () {
        skills.push(parseInt($(this).val()));
    });

    if (!/^\d{1,10}$/.test(maxHp)) {
        maxHp = 100;
    } else {
        maxHp = parseInt(maxHp);
    }
    var player = {
        name: name,
        type: 1,
        basicAttri: basicAttri,
        fightAttri: {},
        attriRate: {},
        hp: maxHp,
        maxHp: maxHp,
        skills: skills
    };


    var basicAttri = {};
    $('#petBasicAttri').find("input").each(function () {
        if ($(this).attr('name')) {
            if (/^\d{1,10}$/.test($(this).val())) {
                basicAttri[$(this).attr('name')] = parseInt($(this).val());
            } else {
                basicAttri[$(this).attr('name')] = 0;
            }
        }
    });
    var name = $('#pet #name').val();
    var maxHp = $('#pet #maxHp').val();
    var skills = [];
    $("#pet select").each(function () {
        skills.push(parseInt($(this).val()));
    });

    if (!/^\d{1,10}$/.test(maxHp)) {
        maxHp = 100;
    } else {
        maxHp = parseInt(maxHp);
    }

    var pet = {
        name: name,
        type: 1,
        basicAttri: basicAttri,
        fightAttri: {},
        attriRate: {},
        hp: maxHp,
        maxHp: maxHp,
        skills: skills
    };
    var route = "battle/addPlay" + index;

    var args = {
        player: JSON.stringify(player),
        pet: JSON.stringify(pet)
    };
    postfunc(route, args, function (data) {

    });
}

function getplayer1(){
    var route = "battle/getPlay1";
    $('.p1').empty();
    $('.data').empty();
    postfunc(route, null, function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            var str = '';
            var k = Math.floor(i / 2);
            if (i % 2 === 0) {
                str = '玩家' + (k + 1) + ' : <span id="name' + (i + 1) + '">' + data[i].name + '</span><br/>';
            } else {
                str = '玩家' + (k + 1) + '宠物 : <span id="name' + (i + 1) + '">' + data[i].name + '</span><br/>';
            }
            str += 'hp： <span id="hp' + (i + 1) + '">' + data[i].hp + '</span><br/>';

            $('.p1').append(str);

            var p = data[i];
            var content = '';
            content = content + '<p  align="left">' + 'hp:' + p.hp + '</p>';
            content = content + '<p  align="left">' + 'name:' + p.name + '</p>';
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
            content = content + '<p  align="left">' + '技能:' + p.skills + '</p>';
            $('.data').append('<div class="con4">' + content + '</div>');
        }
    });
}

function getplayer2(){
    var route = "battle/getPlay2";
    $('.p2').empty();
    postfunc(route, null, function (data) {
        console.log(data);
        $('.data').empty();
        for (var i = 0; i < data.length; i++) {

            var str = '';
            var k = Math.floor(i / 2);
            if (i % 2 === 0) {
                str = '玩家' + (k + 1) + '名字 : <span id="name' + (i + 1) + '">' + data[i].name + '</span><br/>';
            } else {
                str = '玩家' + (k + 1) + '宠物名字 : <span id="name' + (i + 1) + '">' + data[i].name + '</span><br/>';
            }
            str += 'hp： <span id="hp' + (i + 1) + '">' + data[i].hp + '</span><br/>';
            $('.p2').append(str);

            var p = data[i];
            var content = '';

            content = content + '<p  align="left">' + 'hp:' + p.hp + '</p>';
            content = content + '<p  align="left">' + 'name:' + p.name + '</p>';
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
            content = content + '<p  align="left">' + '技能:' + p.skills + '</p>';
            $('.data').append('<div class="con4">' + content + '</div>');
        }
    });
}


function battle1(){
    var route = "battle/battle1";
    battle(route);
}

function battle2(){
    var route = "battle/battle2";
    battle(route);
}

function delplayer1(){
    var route = "battle/delPlay1";
    var index = $('#index').val();
    index = parseInt(index);
    var args = {
        index : index,
    };
    postfunc(route, args, function (data) {});
}

function delplayer2(){
    var route = "battle/delPlay2";
    var index = $('#index').val();
    index = parseInt(index);
    var args = {
        index : index,
    };
    postfunc(route, args, function (data) {});
}
$(document).ready(function () {

    $("#player select").each(function () {
        $(this).append("<option value='0'>普通攻击</option>");
        $(this).append("<option value='101000'>血性狂击</option>");
        $(this).append("<option value='102000'>羽之守护</option>");
        $(this).append("<option value='103000'>兽王击</option>");
        $(this).append("<option value='104000'>狼嚎</option>");
        $(this).append("<option value='105000'>心灵相通</option>");
        $(this).append("<option value='106000'>自然之怒</option>");
        $(this).append("<option value='107000'>弈剑回风</option>");
        $(this).append("<option value='108000'>招魂术</option>");
        $(this).append("<option value='201000'>烽火连天</option>");
        $(this).append("<option value='202000'>鬼舞斩杀</option>");
        $(this).append("<option value='203000'>箭雨</option>");
        $(this).append("<option value='204000'>腐蚀之箭</option>");
        $(this).append("<option value='205000'>破血狂攻</option>");
        $(this).append("<option value='206000'>炼魂</option>");
        $(this).append("<option value='207000'>凝风斩</option>");
        $(this).append("<option value='208000'>箭芒</option>");
        $(this).append("<option value='301000'>点穴封脉</option>");
        $(this).append("<option value='302000'>圣元回天</option>");
        $(this).append("<option value='303000'>星辰变</option>");
        $(this).append("<option value='304000'>沛雨甘霖</option>");
        $(this).append("<option value='305000'>清风如穆</option>");
        $(this).append("<option value='306000'>回风拂柳</option>");
        $(this).append("<option value='307000'>去腐生肌</option>");
        $(this).append("<option value='308000'>炽热光环</option>");
        $(this).append("<option value='401000'>舍我其谁</option>");
        $(this).append("<option value='402000'>狂暴旋风</option>");
        $(this).append("<option value='403000'>孤注一掷</option>");
        $(this).append("<option value='404000'>暴怒</option>");
        $(this).append("<option value='405000'>冲撞</option>");
        $(this).append("<option value='406000'>龙啸九天</option>");
        $(this).append("<option value='407000'>嗜血狂袭</option>");
    });

    $("#pet select").each(function () {
        $(this).append("<option value='0'>普通攻击</option>");
        $(this).append("<option value='111000'>寒水</option>");
        $(this).append("<option value='112000'>岩裂</option>");
        $(this).append("<option value='113000'>啸风</option>");
        $(this).append("<option value='114000'>风起云涌</option>");
        $(this).append("<option value='115000'>奕剑四方</option>");
        $(this).append("<option value='116000'>奕剑八方</option>");
    });

    $("input").each(function () {
        if ($(this).attr('name')) {
            $(this).before('<b>' + $(this).attr('name') + '</b>');
        }
    });

    $("#battle").click(function () {
        battle();
    });

    $("#battle2").click(function () {
        battle2();
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

    $("#getplayer1").click(function () {
        getplayer1();
    });

    $("#getplayer2").click(function () {
        getplayer2();
    });

    $("#delplayer1").click(function () {
        delplayer1();
    });

    $("#delplayer2").click(function () {
        delplayer2();
    });
});
