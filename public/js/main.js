const socket = io();
const chatMessages = document.querySelector('.chat-messages')

const chatForm = document.getElementById('chat-form');

const roomName = document.getElementById('room-name');

const userList = document.getElementById('users');

//Get username and room from URL
const { username, room } = Qs.parse(location.search ,{
    ignoreQueryPrefix: true
});

//Join chat 
socket.emit('joinRoom',{ username,room });

//Get user & room
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});


//Recieving msg from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight; 

});


//On subitting of form

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    //Emmiting msg to server
    socket.emit('chatMessage',msg);

    //Clear Input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//Display user to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join("")}
    `;
}
