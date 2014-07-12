define([
    'gameserver',
    'player'
], function(GameServer, Player){
    var userId = 1;
    var games = {};
    var gameId = 1;

    var user = function() {
        this.id = userId++; //pseudo-unique user id
    };

    user.prototype.initialize = function(socket) {
        this.socket = socket;
        this.on = socket.on;
        this.emit = socket.emit;
    };

    user.prototype.dispose = function() {
        delete this.socket;
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
        this.on('create game', function(){
            var gameName = "Game " + gameId++;
            console.log("Creating new game", gameName);
            var game = new GameServer(gameName);
            games[gameName] = game;
            this.socket.game = game;
            selectHero(this.socket, gameName);
        });
        this.on('select game', function(name){
            if (name in games) {
                this.socket.game = games[name];
                selectHero(this.socket, name);
            }
        });
        this.on('initialize player', function(e){
            this.socket.playerName = e.name;
            console.log("Player " + e.name + " connected");
            this.emit("player initialized");
        });
        this.on('get games', function(e){
            var list = [];
            for(var name in games)
                list.push({name: name});
            this.emit("list of games", list);
        });
        this.on('select hero', function(heroName){
            console.log(socket.playerName, 'selecting', heroName + "!");
            this.socket.game.selectHero(socket.playerName, heroName);
        });
    };

    return user;
});