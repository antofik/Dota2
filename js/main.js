var socket = io();
var name;

var states = {
    new: 0,
    select: 1,
    play: 2
};

function getState() {
    return localStorage.getItem('state') || 0;
}

function setState(state) {
    localStorage.setItem('state', state);
}

function getPlayerName() {
    name = localStorage.getItem('name');
    while (!name || name === "null")
        name = prompt('Enter your login');
    localStorage.setItem('name', name);
    socket.emit('name', name);
}

socket.on("start", function(){
    setHandlers();
    var state = getState();
    if (state === states.new) {
        showAvailableTournaments();
    } else if (state === states.select) {
        showHeroSelection();
    }
});

function start() {
    getPlayerName();
}

socket.on('list of games', function(games) {
    var ul = $("#list_of_games ul.select");
    ul.html('');
    for(var i=0;i<games.length;i++) {
        var game = games[i];
        ul.append('<li>' + game.name + '</li>');
    }
    $('#list_of_games ul.select li').click(function(e){
        var name = $(this).html();
        socket.emit('select game', name);
    });
});

socket.on('list of heroes', function(list) {
    showHeroSelection(list);
});

socket.on('create world', function(state){
    showGame(state);
});

function setHandlers() {
    $('#list_of_games ul.new li').click(function(e){
        socket.emit('create game');
    });
}


function hide() {
    $("#map").hide();
    $("#list_of_games").hide();
    $("#list_of_heroes").hide();
}

var timer;

function showAvailableTournaments() {
    clearTimeout(timer);
    hide();
    $("#list_of_games").show();

    timer = setInterval(function() {
        socket.emit('get games');
    }, 1000);
}

function showHeroSelection(list) {
    var heroes = list.heroes;
    clearTimeout(timer);
    hide();
    $("#list_of_heroes").show();

    var ul = $("#list_of_heroes ul");
    ul.html('');
    for(var i=0;i<heroes.length;i++) {
        var hero = heroes[i];
        ul.append('<li data-name="' + hero.name + '"">' + hero.name + ' - ' + (hero.player || 'free') + '</li>');
    }
    $('#list_of_heroes li').click(function(e){
        var name = $(this).data('name');
        socket.emit('select hero', name);
    });
}

function startControls() {
    /************************* right click *******************/
    var blinker = $('#blinker');
    var blinkerAni = $('#blinker .ani');
    $("#map").bind("contextmenu",function(e){
        blinkerAni.stop();
        blinker.css('opacity', 1);
        blinker.css('left', e.clientX + 'px');
        blinker.css('top', e.clientY + 'px');
        blinkerAni.css('width', '10px');
        blinkerAni.css('height', '10px');
        blinkerAni.css('opacity', 1);
        blinkerAni.css('border-radius', '5px');
        $('#blinker .ani').animate({
            width: '30px',
            height: '30px',
            'border-radius': '15px'
        }, 50);
        $('#blinker .ani').animate({
            opacity: 0
        }, 100);

        socket.emit('move', {x: e.clientX, y: e.clientY});

        return false;
    });
}

var playersUi = {};

function createPlayerUi(player) {
    $("#players").append("<div style='background:" + player.color + "' id='" + player.name + "' class='player'><div class='health'></div><div class='name'></div></div>");
    var ui = $("#" + player.name);
    $('.name', ui).html(player.name);
    return ui;
}

function showGame(state) {
    clearTimeout(timer);
    hide();
    $("#map").show();

    startControls();

    var players = state.players;
    for(var name in players) {
        playersUi[name] = createPlayerUi(players[name]);
    }
    var player1 = $('#player1');
    var player2 = $('#player2');
    socket.on('game state', function(state){
        var players = state.players;
        for(var name in players) {
            var player = players[name];
            var ui = playersUi[name];
            ui.stop();
            /*ui.css({
             left: (player.x) + 'px',
             top: (player.y) + 'px',
             }); */
            ui.animate({
                left: (player.x + player.vx) + 'px',
                top: (player.y + player.vy) + 'px',
            }, 1000, 'linear');
        }
    });
}

$(start);