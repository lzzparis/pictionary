var pictionary = function() {
    var socket = io();
    var canvas, context;

    var draw = function(position) {
        console.log("in draw");
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };

    var drawing = false;

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        if(drawing){
          draw(position);
          socket.emit('draw', position); 
        }
    })
    .on('mousedown', function(event){
      drawing = true;
    })
    .on('mouseup', function(event){
      drawing = false;
    });


    socket.on('draw',draw);
    var guessBox;
    
    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        var guess = guessBox.val();
        console.log(guess);
        guessBox.val('');
        socket.emit('guess',guess);
    };
    socket.on('guess', displayGuess);   

    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
  
    guessesDisplay = $('#guesses-display');

    var displayGuess = function(guess){
      console.log("hit"); 
      guessesDisplay.append("<p>"+guess+"</p>");
    };

};

$(document).ready(function() {
    pictionary();
});
