var skillAttack = require("./skillAttack");
var playerAttri = require("./playerAttri");
var userDao = require("../../dao/userDao");
var playerDao = require("../../dao/playerDao");
var skillAttack = require("./skillAttack1");
var playerAttri = require("./playerAttri");
var redisClient = require('../../dao/redis/redisClient');

module.exports = function(app) {
    app.all('/player/*', function(req, res, next) {
        //是否选择角色
        if (req.session.userId) {
            redisClient.hget(req.session.userId, 'playerid', function(err, playerid) {
                if (err) {
                    res.send({
                        error: 102
                    });
                    return;
                }
                if (!playerid) {
                    res.send({
                        error: 103
                    });
                    return;
                }
                redisClient.get(playerid, function(err, redisPlayer) {
                    var player = JSON.parse(redisPlayer);
                    req.player = playerAttri.Player(player);
                    playerAttri.calcPlayer(req.player);
                    next();
                });
            });
        } else {
            res.send({
                error: 101
            });
            return;
        }
    });

    app.post('/player/lvlPlayer', function(req, res) {
        var player = req.player;
        playerAttri.lvlup(player);
        playerAttri.calcPlayer(player);
        playerStr = JSON.stringify(player);
        redisClient.set(player.id, playerStr);
        res.send({
            error: 0,
            player: player
        });
    });

    app.post('/player/lvlPlayerByexp', function(req, res) {
        var player = req.player;
        if (player.exp >= player.lvlexp) {
            player.exp = player.exp - player.lvlexp;
            playerAttri.lvlup(player);
            player.lvlexp = global.lvlexp[player.lvl];
            playerAttri.calcPlayer(player);
            playerStr = JSON.stringify(player);
            redisClient.set(player.id, playerStr);
            res.send({
                error: 0,
                player: player
            });
            return;
        }
        res.send({
            error: 2
        });
    });
    app.post('/player/selectMap', function(req, res) {
        var mapId = req.body.mapId;
        req.player.mapId = mapId;
        var playerStr = JSON.stringify(req.player);
        console.log(playerStr);
        redisClient.set(req.player.id, playerStr);
        res.send({
            error: 0,
            mapId: mapId
        });
        return;
    });

    app.post('/player/battleOnMap', function(req, res) {
        var mapId = '' + req.player.mapId;
        var array = global.monsterMap[mapId].queue;
        var l = Math.floor(Math.random() * array.length);
        var fightStruct1 = [req.player];
        var fightStruct2 = [global.monsterMap[mapId][array[l]]];
        redisClient.hset(req.session.userId, 'battleTime', new Date().getTime());
        var fightRecord = skillAttack.startBattle2(fightStruct1, fightStruct2);
        res.send({
            error: 0,
            fightRecord: fightRecord
        });
        var playerStr = JSON.stringify(req.player);
        redisClient.set(req.player._id, playerStr);
        return;
    });

    app.post('/player/getPlayer', function(req, res) {
        res.send({
            error: 0,
            player: req.player
        });
        return;
    });
};