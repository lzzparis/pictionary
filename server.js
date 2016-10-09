var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var tapDrawer = true;
var correctWord = null;

debugger
io.on("connection", function(socket){
  socket.emit('tap',tapDrawer);
  tapDrawer = false;
  socket.on('storeWord',function(word){
    correctWord = word;
    console.log(correctWord);
  });
  socket.on("draw", function(position){
    socket.broadcast.emit('draw', position);
  });
  socket.on('guess', function(guess){
    socket.broadcast.emit('guess', guess);
    if(guess===correctWord){
      socket.emit('won',correctWord);
      socket.broadcast.emit('gameOver',correctWord);
      
    }
  });
  
});

server.listen(process.env.PORT || 8080);
