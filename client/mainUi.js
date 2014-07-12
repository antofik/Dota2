define([
    'jquery',
    'pages/map',
    'pages/gameSelection',
    'pages/heroSelection',
    'server',
    'player'
], function($, Map, Games, Heroes, Server, Player){
    var ui;

    Server.on("player initialized", function(){
        ui.initialized();
    });

    Server.on("game selected", function(){
        ui.showHeroSelection();
    });

    Server.on("create world", function(){
        ui.showMap();
    });

    ui = {
        initialize: function() {
            Player.initialize();
        },

        initialized: function() {
            ui.showGameSelection();
        },

        showGameSelection: function() {
            Games.show();
            Heroes.hide();
            Map.hide();
        },

        showHeroSelection: function() {
            Games.hide();
            Heroes.show();
            Map.hide();
        },

        showMap: function() {
            Games.hide();
            Heroes.hide();
            Map.show();
        }
    };

    return ui;
});