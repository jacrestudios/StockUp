var io;
var rsocket;

exports.init = (sio, socket) => {
    io = sio;
    rsocket = socket;
    rsocket.emit('connected')
    
    //Socket Listeners
    
    //Common
    rsocket.on();
    //Host
    rsocket.on('createGame', onCreateGame);
    //Player
    rsocket.on();
    
    //Listener Functions
    var onCreateGame = data => {};
}
