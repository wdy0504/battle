'use strict';

var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');
var RedisStore = require('connect-redis')(express.session);

module.exports = function (app, opts) {
    return new Server(app, opts);
};

var DEFAULT_HOST = '127.0.0.1';
var DEFAULT_PORT = 8001;

var createLogger = function () {
    return express.logger({
        format: 'short',
        stream: {
            write: function (str) {
                console.log(str);
            }
        },
    })
};

var Server = function (app, opts) {
    opts = opts || {};
    this.app = app;
    this.server = express();
    // console.log('Http opts:', opts);
    this.host = opts.host || DEFAULT_HOST;
    this.port = opts.port || DEFAULT_PORT;
    this.protocol = opts.protocol || 'http';
    this.server.set('port', this.port);

    this.server.set('views', path.join(app.getBase, 'app/servers/' + opts.name + '/views'));
    this.server.use(createLogger());
    this.server.use(express.urlencoded());
    this.server.use(express.json());
    this.server.use(express.methodOverride());
    this.server.use(express.cookieParser());
    
     this.server.use(express.session({
     secret: 'product',
     store: new RedisStore({
     host: "127.0.0.1",
     port: 6379,
     }),
     cookie: {
     maxAge: 1000 * 60 * 60 * 24 * 2
     }, //2 days
     }));
   // this.server.use(express.session({secret: 'product'}));
    this.server.use(this.server.router);
    this.server.use(express.static(path.join(app.getBase, 'app/servers/' + opts.name + '/views')));

    var self = this;
    self.server.use(express.errorHandler());
    ;

    var routesPath = path.join(this.app.getBase, 'app/servers/' + opts.name);

    //先加载index.js
    var routePath = path.join(routesPath, 'index.js');
    if (fs.existsSync(routePath)) {
        require(routePath)(self.server);
    }

    fs.readdirSync(routesPath).forEach(function (file) {
        //然后加载所有js文件，除了先前加载的index.js
        if (/Route.js$/.test(file) && file !== 'index.js') {
            var routePath = path.join(routesPath, file);
            require(routePath)(self.server);
        }
    });

    if (this.protocol === 'https') {
        var key = fs.readFileSync(path.join(app.getBase, 'config/privatekey.pem'));
        var cert = fs.readFileSync(path.join(app.getBase, 'config/certrufucate.pem'));
        var https_option = {
            key: key,
            cert: cert
        };
        https.createServer(https_option, self.server).listen(self.port, function () {
            console.log(opts.name + ' server listening on https://127.0.0.1：' + self.port);
        });
    } else {
        http.createServer(self.server).listen(self.port, function () {
            console.log(opts.name + ' server listening on http://127.0.0.1：' + self.port);
        });
    }
};