const app = require('express')();
const http = require('http').createServer(app);
const cors = require('cors')

const PORT = 8080;

const io = require('socket.io')(http, {
    cors: "*"
});

const formatMessage = require('./chat-helpers/formatDate')
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers
} = require('./chat-helpers/userHelper');

// this block will run when the client connects
io.on('connection', socket => {
    //When an user joins the room
    socket.on('joinRoom', ({ username, room }) => {
      const user = newUser(socket.id, username, room);  
      socket.join(user.room);
  
      // General welcome
      socket.emit('message', formatMessage("Teenage Concerns", 'Messages are limited to this room! '));

      // Broadcast everytime users connects
      socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage("Teenage Concerns", `${user.username} has joined the room`)
      );
  
      // Current active users and room name
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });

    });
  
    // Listen for client message
    socket.on('chatMessage', msg => {
      // console.log(msg);
      const user = getActiveUser(socket.id);
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
  
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = exitRoom(socket.id);
  
      if(user) {
        io.to(user.room).emit(
          'message',
          formatMessage("Teenage Concerns", `${user.username} has left the room`)
        );
  
        // Current active users and room name
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getIndividualRoomUsers(user.room)
        });
      }
    });

  });

http.listen(PORT, () => {
    console.log("Listening on PORT", PORT);
})