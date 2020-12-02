const express = require('express');

const http = require('http');

const path = require('path');

const app = express();

const socketio = require('socket.io');

const port = 8000;

const server = http.createServer(app);

const io = socketio(server);

const formatMessage = require('./service/messages')

//Set public folder for front-end
app.use(express.static(path.join(__dirname,'public')));

//Run when user connects
io.on('connection', socket => {
    console.log('connection established using sockets...!');

    //When new user connects
    socket.emit('message', formatMessage('Chat App admin','Welcome to Chat App!'));

    //Broadcast when a user connects'
    socket.broadcast.emit('message',formatMessage('Chat App admin','A user has joined the chat'));

    //When user disconnects
    socket.on('disconnect',() =>{
        io.emit('message',formatMessage('Chat App admin', 'A user has left the chat'));
    });

    //Listening to chatMessage
    socket.on('chatMessage',msg => {
        io.emit('message',formatMessage('USER',msg));
    });
});

server.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});