var redis = require('redis');

var redisIp = '127.0.0.1';
var redisPort = '6379';

var redisClient = redis.createClient(redisPort, redisIp);
/*
redisClient.auth('redis20141101123', function(err){
    if(err){
        console.log("redisClient auth Error" + err);
        return false;
    }
});
*/
redisClient.on("error", function (err) {
    console.log("redisClient Error" + err);
    return false;
});

module.exports = redisClient;

