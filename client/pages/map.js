define([
    'jquery',
    'server'
], function($, Server){
    var page;

    $(function(){
        page = $('#map');
    });
    
    Server.on('create world', function(state){
        showGame(state);
    });

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

            Server.emit('move', {x: e.clientX, y: e.clientY});

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
        startControls();

        var players = state.players;
        for(var name in players)
            if (players.hasOwnProperty(name))
                playersUi[name] = createPlayerUi(players[name]);

        Server.on('game state', function(state){
            var players = state.players;
            for(var name in players)
                if (players.hasOwnProperty(name)) {
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

    return {
        show: function() {
            page.show();
        },

        hide: function() {
            page.hide();
        }
    };
});