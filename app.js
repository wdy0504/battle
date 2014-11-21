var path = require('path');
var server = require('./app/http');
//var serversPath = path.join(__dirname + '/config/servers.json');
//var servers = require(serversPath);
var serverconf = {
    name : "http", port : 8001, host : "127.0.0.1", protocol : "http"
}
var app = {
    getBase : __dirname + '/'
};
server(app, serverconf);
