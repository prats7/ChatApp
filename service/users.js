const users = [];

//joining user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    user.push(user);

    return user;
}

//Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

module.exports = {
    userJoin,
    getCurrentUser
}