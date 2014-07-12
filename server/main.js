define([
    'webserver',
    'user'
], function(WebServer, User){

    WebServer.start();

    WebServer.io.on('connection', function(socket){
        var user = new User();
        user.initialize(socket);
        socket.on('disconnect', user.dispose);
        user.serve();
    });
});
