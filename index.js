let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
 
io.on('connection', (socket) => {
  
  socket.on('disconnect', function(){
    console.log(socket.nickname+' disconnected');
    io.emit('users-changed', {user: socket.nickname, event: 'left'});   
  });
 
  socket.on('set-nickname', (nickname) => {
    socket.nickname = nickname;
    console.log('Nickname set to '+nickname);
    io.emit('users-changed', {user: nickname, event: 'joined'});    
  });
  
  socket.on('add-message', (message) => {
    console.log('add msg ');
    io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
  });

  socket.on('register', (from) => {
    socket.join(from);
  });

  socket.on('start', (data) => {
    io.sockets.in(data.to).emit('ready', {location_lat: data.location_lat,location_lon: data.location_lon});
  });

});
 
var port = process.env.PORT || 3001;
 
http.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});