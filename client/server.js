define([
    //'socket.io-client'
], function(){
    var server = io('/', {
        reconnection: true,
        reconnectionDelay: 100
    });
    window.server = server;
    return server;
});