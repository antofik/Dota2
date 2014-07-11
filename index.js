var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();

app.get('/', function(req, res){
  res.sendfile('index.html');
});
console.log('dirname', __dirname);
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));

var sockets = [];
var games = {};
var gameId = 1;

GameServer = require('./gameserver.js').ctor;

io.on('connection', function(_socket){
  var socket = _socket;
  sockets.push(socket);

  socket.on('create game', function(){
    var name = "Game " + gameId++;
    console.log("Creating new game", name);
    var game = new GameServer(name);
    games[name] = game;
    socket.game = game;
    selectHero(socket, name);
  });
  socket.on('select game', function(name){
    if (name in games) {
      socket.game = games[name];
      selectHero(socket, name);
    }
  });
  socket.on('name', function(name){
    socket.playerName = name;
    console.log("Player " + name + " connected");
    socket.emit("start");
  });
  socket.on('get games', function(e){
    var list = [];
    for(var name in games)
      list.push({name: name});
    socket.emit("list of games", list);
  });
  socket.on('select hero', function(heroName){ 
    console.log(socket.playerName, 'selecting', heroName + "!");
    socket.game.selectHero(socket.playerName, heroName);
  });
});

function selectHero(socket, gameName) {
    console.log("All players should select a hero. Waiting...");    
    var game = games[gameName];
    game.addPlayer(socket.playerName, socket);
    if (socket.waitingForHeroes) return;
    socket.waitingForHeroes = true;
    function waitForHeroes(){      
      if (game.isSelecting()) {
        socket.emit('list of heroes', game.listOfHeroes());
        setTimeout(waitForHeroes, 1000);
      } else {
        socket.waitingForHeroes = false;
        console.log(socket.playerName + ", game is starting!");
        game.start();
      }
    }
    waitForHeroes();
}

http.listen(3000, function(){
  console.log('listening on *:3000');
});

