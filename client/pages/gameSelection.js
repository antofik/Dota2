define([
    'jquery',
    'server'
], function($, Server) {
    var page, list, item;

    $(function(){
        page = $('#list_of_games');
        list = $('ul.select', page);

        $('ul.new li', page).click(function(){
            Server.emit('create game');
        });
    });

    Server.on('list of games', function(games) {
        list.html('');
        for(var i=0;i<games.length;i++) {
            var game = games[i];
            list.append('<li data-name="' + game.name + '">' + game.name + '</li>');
        }
        $('li', list).click(function(e){
            var name = $(this).data('name');
            Server.emit('select game', name);
        });
    });

    var timer;
    function showAvailableGames() {
        clearTimeout(timer);
        timer = setInterval(function() {
            Server.emit('get games');
        }, 1000);
    }

    return {
        show: function() {
            page.show();
            showAvailableGames();
        },

        hide: function() {
            page.hide();
            clearTimeout(timer);
        }
    };
});