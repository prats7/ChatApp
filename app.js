const express = require('express');

const http = require('http');

const path = require('path');

const app = express();

const socketio = require('socket.io');

const server = http.createServer(app);

//Socket setup
const io = socketio(server);

const formatMessage = require('./service/messages');

const { userJoin,getCurrentUser,userLeave, getUsers } = require('./service/users');

//Set public folder for front-end
app.use(express.static(path.join(__dirname,'public')));

//Run when user connects
io.on('connection', socket => {
    console.log('connection established using sockets...!');

    socket.on('joinRoom',({username , room }) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //When new user connects
        socket.emit('message', formatMessage('Chat App admin','Welcome to Chat App!'));

        //Broadcast when a user connects'
        socket.broadcast.to(user.room).emit(
            'message',
            formatMessage('Chat App admin',`${user.username} has joined the chat`
            ));
        //Display user & room
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getUsers(user.room)
        });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

    });

    
    //Listening to chatMessage
    socket.on('chatMessage',msg => {

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });

    //When user disconnects
    socket.on('disconnect',() =>{

        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage('Chat App admin', `${user.username} has left the chat`));

        //Display user & room
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getUsers(user.room)
        });
        }
    });


});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));