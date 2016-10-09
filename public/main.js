var pictionary = function() {
    var socket = io();
    var canvas, context;
    var amDrawer = null;

    var draw = function(position) {
      console.log("in draw");
      context.beginPath();
      context.arc(position.x, position.y,
                     6, 0, 2 * Math.PI);
      context.fill();
    };

    var drawing = false;
    var guessElement = $("#guess");
    var guessBox = $('#guess input');
    var topMessage = $('#top-message');
  
    var guessesDisplay = $('#guesses-display');
    var displayGuess = function(guess){
      console.log("hit"); 
      guessesDisplay.append("<p>"+guess+"</p>");
    };
    var tapDrawer = function(wasTapped){
      if(wasTapped){
        topMessage.append("<h2>Start drawing!</h2>");
        amDrawer = true;
      }
      else{ 
        guessElement.css("display","block");
        amDrawer = false;
      }
    }
    var onKeyDown = function(event) {
        if (event.keyCode != 13) { // Enter
            return;
        }
        var guess = guessBox.val();
        console.log(guess);
        guessBox.val('');
        socket.emit('guess',guess);
        displayGuess(guess);
    };
    guessBox.on('keydown', onKeyDown);


    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        if(drawing && amDrawer){
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
    
    socket.on('guess', displayGuess);   

    socket.on("tap",tapDrawer);

};

$(document).ready(function() {
    pictionary();
});
