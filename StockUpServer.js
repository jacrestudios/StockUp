var io;
var rsocket;

exports.init = (sio, socket) => {
    io = sio;
    rsocket = socket;
    rsocket.emit('connected')
    
    //Events
    //Common
    //Host
    //Player
}
