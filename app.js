const express = require('express');

const http = require('http');

const path = require('path');

const app = express();

const socketio = require('socket.io');

const port = 8000;

const server = http.createServer(app);

const io = socketio(server);

//Set public folder for front-end
app.use(express.static(path.join(__dirname,'public')));

//Run when user connects
io.on('connection', socket => {
    console.log('connection established using sockets...!');

    //When new user connects
    socket.emit('message','Welcome to Chat App!');

    //Broadcast when a user connects'
    socket.broadcast.emit('message','A user has joined the chat');

    //When user disconnects
    socket.on('disconnect',() =>{
        io.emit('message', 'A user has left the chat');
    });

    //Listening to chatMessage
    socket.on('chatMessage',msg => {
        io.emit('message',msg);
    });
});

server.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});