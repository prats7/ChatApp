const socket = io();

const chatMessages = document.querySelector('.chat-messages')

const chatForm = document.getElementById('chat-form');

const roomName = document.getElementById('room-name');

const userList = document.getElementById('users');

const message = document.getElementById('msg');

const feedback = document.getElementById('feedback');

const usernames = document.getElementById('username');

//Get username and room from URL
const { username, room } = Qs.parse(location.search ,{
    ignoreQueryPrefix: true
});

//Join chat (Emit Events)
socket.emit('joinRoom',{ username,room });

//Get user & room
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

//Listen for events
//Recieving msg from server
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight; 

});

message.addEventListener('keypress', function(){
    socket.emit('typing', userList.value
    );
})



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

    feedback.innerHTML="";
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

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
