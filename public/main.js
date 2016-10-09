var WORDS = [
    "word", "letter", "number", "person", "pen", "class", "people", "sound", "water", "side", "place", "man", "men", "woman", "women", "boy", "girl", "year", "day", "week", "month", "name", "sentence", "line", "air", "land", "home", "hand", "house", "picture", "animal", "mother", "father", "brother", "sister", "world", "head", "page", "country", "question", "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree", "farm", "story", "sea", "night", "day", "life", "north", "south", "east", "west", "child", "children", "example", "paper", "music", "river", "car", "foot", "feet", "book", "science", "room", "friend", "idea", "fish", "mountain", "horse", "watch", "color", "face", "wood", "list", "bird", "body", "dog", "family", "song", "door", "product", "wind", "ship", "area", "rock", "order", "fire", "problem", "piece", "top", "bottom", "king", "space"
];

var pictionary = function() {
    var socket = io();
    var canvas, context;
    var amDrawer = null;
    var word = null;

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
    var instructions = $('#instructions');
    var results = $('#results');
  
    var guessesDisplay = $('#guesses-display');
    var displayGuess = function(guess){
      console.log("hit"); 
      guessesDisplay.append("<p>"+guess+"</p>");
    };
    var tapDrawer = function(wasTapped){
      var wordIndex = Math.floor(Math.random()*(WORDS.length));
      word = WORDS[wordIndex];
      console.log(word, wordIndex);
      if(wasTapped){
        instructions.html("<h2>Your word is <span>"+word+"</span>. Start drawing!</h2>");
        instructions.css("display","block");
        socket.emit('storeWord',word);
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

    var displayResults = function(){
      guessElement.css("display","none");  
      instructions.css("display","none");  
      results.css("display","block");  

    };

    var iWon = function(correctWord){
      results.html("<h2>YOU WON! The correct word is <span>"+correctWord+"</span></h2>");
      displayResults();
    };

    var gameOver = function(correctWord){
      results.html("<h2>Someone won! The correct word is <span>"+correctWord+"</span></h2>");
      displayResults();
  };

    socket.on('draw',draw);
    
    socket.on('guess', displayGuess);   

    socket.on("tap",tapDrawer);

    socket.on("won",iWon);
    socket.on("gameOver",gameOver);

};

$(document).ready(function() {
    pictionary();
});
