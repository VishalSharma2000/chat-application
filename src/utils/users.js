const users = [];

// Adding new User
const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate username and room
  if (!username || !room) {
    return {
      error: 'Username and room is required',
    };
  }

  // Check if username already present in the room
  const alreadyPreset = users.find(user => (user.username === username && user.room === room));
  if (alreadyPreset) {
    return {
      error: 'Username already in use'
    };
  }

  // add user
  const user = { id, username, room };
  users.push(user);

  return {user};
};

const removeUser = (id) => {
  if (!id) {
    return {
      error: 'ID required to remove user',
    };
  }

  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => {
  if (!id) return { error: 'ID required to remove user' }

  return users.find(user => user.id === id);
};

const getUsersInRoom = room => {
  return users.filter(user => (
    user.room === room
  ));
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}