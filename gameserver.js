var server = function() {
	this.players = {};
	this.count = 0;
	this.radiant = [];
	this.dire = [];
	this.heroes = [
		{name: "Sniper", color: "blue", speed: 100, free: true, player: ""},
		{name: "Mage", color: "orange", speed: 90, free: true, player: ""}];
	this.started = false;
	this.finished = false;
	this.time = +new Date();
}
exports.ctor = server;

server.prototype.listOfHeroes = function(playerName) {
	return {
		heroes: this.heroes
	}
};

var Player = require('./player.js');

server.prototype.addPlayer = function(playerName, socket) {
	if (playerName in this.players) return;
	this.count++;
	var player = new Player.constructor(playerName, socket);
	this.players[playerName] = player;
};

server.prototype.selectHero = function(playerName, heroName) {
	var player = this.players[playerName];
	if (!player) return;

	if (player.hasSelectedHero()) {
		console.log(playerName, " already selected a hero " + player.hero.name);
		return;
	}

	for(var i=0;i<this.heroes.length;i++) {
		var hero = this.heroes[i];
		if (hero.name === heroName) {
			if (!hero.free) {
				console.log(heroName, "already taken by", hero.player);
				return;
			}
			hero.free = false;
			hero.player = playerName;
			player.selectHero(hero);			
		}
	}
};

server.prototype.isSelecting = function() {
	if (this.count < 1) return true;
	for(var name in this.players)
		if (!this.players[name].hasSelectedHero())
			return true;	
	return false;
};

server.prototype.placePlayers = function() {
	for(var name in this.players) {
		var player = this.players[name];
		player.x = Math.floor(100 + 200*Math.random());
		player.y = Math.floor(100 + 100*Math.random());
		player.vx = 0;
		player.vy = 0;
		player.targetX = player.x;
		player.targetY = player.y;
		player.canMove = true;
	};
};

server.prototype.getWorldState = function() {
    var state = {players: {}};
	for(var name in this.players) {
		state.players[name] = this.players[name].toJson();
	}
	return state;
};

server.prototype.isPassable = function(obj, x, y) {
	var ok = true;

	for(var name in this.players) {
		var player = this.players[name];
		if (player === obj) continue;
		if (player.distanceTo(obj) < player.radius + obj.radius) {
			ok = false;
			break;
		}
	}

	return ok;
};

server.prototype.gameLoop = function(game) {
	var g = game;
    var delta = new Date() - g.time;
    g.time += delta;
    delta /= 1000;

	for(var name in this.players) {
		this.players[name].update(delta, g);
	}


	var timeSinceLastUpdate = new Date() - g.lastUpdate;
	if (timeSinceLastUpdate > 100) {
		g.lastUpdate = +new Date();
		var state = g.getWorldState();
		for(var name in this.players) {
			this.players[name].socket.emit('game state', g.getWorldState());
		}
	}

	if (!g.finished) {
		setTimeout(function(){g.gameLoop.call(g, g);}, 10);
	} 
	else {
		g.finishGame();
	}
};

server.prototype.finishGame = function() {
};

server.prototype.dummy = function() {
};

server.prototype.start = function() {
	if (this.started) return;
	this.started = true;

	this.placePlayers();

	var state = this.getWorldState();
	for(var name in this.players) {
		console.log("create world for", this.players[name].socket.playerName);
		this.players[name].socket.emit('create world', state);
	}

	var g = this;
	g.lastUpdate = +new Date();
	setTimeout(function() {
		g.gameLoop(g)
	}, 1000);
};