define([

], function(){
    var express = require('express');
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    function start() {
        app.get('/', function (req, res) {
            res.sendfile('client/index.html');
        });
        app.use('/img', express.static('client/img'));
        app.use('/js', express.static('client'));
        app.use('/css', express.static('client/css'));

        http.listen(3000, function () {
            console.log('listening on *:3000');
        });
    }

    return {
        start: start,
        express: express,
        app: app,
        http: http,
        io: io
    };
});
