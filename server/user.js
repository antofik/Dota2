define([
    'gameserver',
    'player'
], function(GameServer, Player){
    var userId = 1;
    var games = {};
    var gameId = 1;

    var user = function() {
        this.id = userId++; //pseudo-unique user id
        console.log("New user connected", this.id);
    };

    user.prototype.initialize = function(socket) {
        this.socket = socket;
        this.socket.error(function(){
           console.log('########error################');
        });
    };

    user.prototype.dispose = function() {
        delete this.socket;
        console.log("User disconnected", this.id);
    };

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
        socket.emit('game selected', {});
    }

    function removeInactiveGames() {
        var badGames = [];
        for(var name in games)
            if (games.hasOwnProperty(name))
                if (!games[name].isActive())
                    badGames.push(name);
        for(var i=0;i<badGames.length;i++)
            delete games[badGames[i]];
    }

    setInterval(removeInactiveGames, 100);

    user.prototype.serve = function() {
        var socket = this.socket;
        socket.on('create game', function(){
            var gameName = "Game " + gameId++;
            console.log("Creating new game", gameName);
            var game = new GameServer(gameName);
            games[gameName] = game;
            socket.game = game;
            selectHero(socket, gameName);
        });
        socket.on('select game', function(name){
            if (name in games) {
                socket.game = games[name];
                selectHero(socket, name);
            }
        });
        socket.on('initialize player', function(e){
            console.log("%$#$%#$%#$%$3");
            socket.playerName = e.name;
            console.log("Player " + e.name + " connected");
            socket.emit("player initialized");
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
    };

    return user;
});