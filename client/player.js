define([
    'storage',
    'server'
], function(Storage, Server){
    var player = {
        name: '',

        initialize: function() {
            player.name = Storage.get('name');
            while (!player.name)
                player.name = prompt('Enter your login');
            Storage.set('name', player.name);
            Server.emit('initialize player', {name: name});
        }
    };
    return player;
});