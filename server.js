const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const RPSgame = require('./RPSgame');

// const clientPath = `${__dirname}/../client`;
const clientPath = `client`;
console.log(`serving static from: ${clientPath}`);

app.use(express.static(clientPath));
const server = http.createServer(app);
const io = socketio(server);

let waitingPlayer = null;

io.on('connection',(sock) => {
    if(waitingPlayer) {
        new RPSgame(waitingPlayer,sock);
        waitingPlayer = null;
    }
    else{
        waitingPlayer = sock;
        waitingPlayer.emit('message','Waiting for an opponent');
    }
    // sock.on('message',(msg) => {
    //     io.emit('message',msg);
    // });
    
});
server.on('error',(err) =>{
    console.error('Server error:',err);
}); 

var port = process.env.PORT || 8080;
server.listen(port,() => {
    console.log('server is started');
});