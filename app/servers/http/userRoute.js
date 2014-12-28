var skillAttack = require("./skillAttack");
var playerAttri = require("./playerAttri");
var userDao = require("../../dao/userDao");
var playerDao = require("../../dao/playerDao");
var playerAttri = require("./playerAttri");
var redisClient = require('../../dao/redis/redisClient');
var utils = require("../../util/util");
module.exports = function(app) {
    app.post('/user/register', function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        userDao.getUserByQuery({
            username: username
        }, function(err, user) {
            if (err || user) {
                res.send({
                    error: 2
                })
                return;
            }
            var _id = 'U' + uuid(10);
            userDao.newAndSave(_id, username, password, function(err, objects) {
                if (err) {
                    res.send({
                        error: 102
                    });
                    return;
                }
                console.log(objects);
                res.send({
                    error: 0
                });
            });
        });
    });
    app.post('/user/login', function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        userDao.getUserByQuery({
            username: username,
            password: password
        }, function(err, user) {
            if (err) {
                res.send({
                    error: 102
                });
                return;
            }
            if (!user) {
                res.send({
                    error: 3
                })
            }
            req.session.username = username;
            req.session.userId = user._id;
            redisClient.hset(req.session.userId, 'username', username);
            res.send({
                error: 0
            })
        });
    });

    app.all('/user/*', function(req, res, next) {
        //用户是否登录
        if (req.session.userId) {
            next();
        } else {
            res.send({
                error: 101
            });
            return;
        }
    });

    app.post('/user/addPlayer', function(req, res) {
        var name = req.body.name
        var basicAttri = new playerAttri.BasicAttri({
            str: 1,
            con: 1,
            wil: 1,
            dex: 1,
            spi: 1,
            maxHp: 20,
            attack: 5,
            defend: 3,
            critHurt: 20
        });
        var id = 'P' + utils.uuid(10);
        var p = {
            id: id,
            userId: req.session.userId,
            name: name,
            basicAttri: basicAttri,
            skills: [0, 0, 0, 0],
            lvlexp: global.lvlexp[1]
        }
        var player = new playerAttri.Player(p);
        playerAttri.calcPlayer(player);
        playerStr = JSON.stringify(player);
        console.log(player);
        redisClient.sadd('P' + req.session.userId, player.id);
        redisClient.set(player.id, playerStr);
        res.send({
            error: 0,
            player: player
        });
    });

    app.post('/user/selectPlayer', function(req, res) {
        var playerId = req.body.playerId;
        redisClient.smembers('P' + req.session.userId, function(err, members) {
            if (err) {
                res.send({
                    error: 3
                });
            }
            if (members.join('|').indexOf(playerId) === -1) {
                res.send({
                    error: 4
                });
                return;
            }
            redisClient.get(playerId, function(err, playerStr) {
                if (err || playerStr === null) {
                    res.send({
                        error: 102
                    });
                    return;
                }
                redisClient.hset(req.session.userId, 'playerid', playerId);
                res.send({
                    error: 0
                });
            });
        });
    });

    app.post('/user/getPlayers', function(req, res) {
        redisClient.smembers('P' + req.session.userId, function(err, members) {
            if (err) {
                res.send({
                    error: 102
                });
            }
            res.send({
                error: 0,
                players: members
            });
        });
    });

    app.post('/user/delPlayer', function(req, res) {
        var playerId = req.body.playerId;
        redisClient.srem('P' + req.session.userId, playerId, function(err, ret) {
            if (err) {
                res.send({
                    error: 102
                });
                return;
            }
            if (ret !== 0) {
                redisClient.del(playerId);
            }
            res.send({
                error: 0,
                ret: ret
            });
        })
    });
};

