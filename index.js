var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

var sockets = [];

io.on('connection', function(socket){
  sockets.push(socket);
  socket.on('move', function(e){
    player1.targetX = e.x;
    player1.targetY = e.y;
  });
});

var Player = require('./player.js');
var player1 = new Player.constructor('player1');
var player2 = new Player.constructor('player1');

player1.x = 300;
player1.y = 200;
player1.vx = 0;
player1.vy = 0;

player2.x = 1000;
player2.y = 800;

var time = +new Date();
var i = 0;
setInterval(function(){
    var delta = new Date() - time;
    time += delta;
    delta /= 1000;
    
    player1.update(delta);
    player2.update(delta);

    var positions = {
        'player1': player1.toJson(),
        'player2': player2.toJson()
    };
    if (++i % 3 === 0) 
    io.emit('position', positions);
}, 100);

http.listen(3000, function(){
  console.log('listening on *:3000');
});