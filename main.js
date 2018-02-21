var inquirer = require('inquirer');
var guessWordList = require('./game.js');
var checkForLetter = require('./word.js');
var lettersToDisplay = require('./letter.js');
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var lettersAlreadyGuessed = [];
var lettersCorrectlyGuessed = [];      
var displayHangman;

var game = {

  wordBank : guessWordList, 
  guessesRemaining : 10, 
  currentWrd : null, 


  startGame : function(){

    this.guessesRemaining = 10;


    var j = Math.floor(Math.random() * this.wordBank.length);
    this.currentWrd = this.wordBank[j];

    console.log('Have you been playing Rainbow Six Siege? Guess the operator names:');

    displayHangman = new lettersToDisplay(this.currentWrd);
    displayHangman.parseDisplay();
    console.log('Guesses Left: ' + game.guessesRemaining);

    keepPromptingUser();
  }

};

function keepPromptingUser(){

  console.log('');

  if(game.guessesRemaining > 0){
    inquirer.prompt([
      {
        type: "value",
        name: "letter",
        message: "Guess a Letter: "
      }
    ]).then(function(userInput){

      var inputLetter = userInput.letter.toLowerCase();
      
      if(alphabet.indexOf(inputLetter) == -1){

        console.log('Are you retarded?"' + inputLetter + '" is not a letter. Fix it:');
        console.log('Guesses Left: ' + game.guessesRemaining);
        console.log('Letters already guessed: ' + lettersAlreadyGuessed);
        keepPromptingUser();

      }
      else if(alphabet.indexOf(inputLetter) != -1 && lettersAlreadyGuessed.indexOf(inputLetter) != -1){

        console.log('Are you high? You already guessed "' + inputLetter + '". Guess again idiot:');
        console.log('Guesses Left: ' + game.guessesRemaining);
        console.log('Letters already guessed: ' + lettersAlreadyGuessed);
        keepPromptingUser();

      }
      else{

        lettersAlreadyGuessed.push(inputLetter);

        var letterInWord = checkForLetter(inputLetter, game.currentWrd);

        if(letterInWord){

          lettersCorrectlyGuessed.push(inputLetter);

          displayHangman = new lettersToDisplay(game.currentWrd, lettersCorrectlyGuessed);
          displayHangman.parseDisplay();

          if(displayHangman.winner){
            console.log('Looks like you actually played the game, or just took a peek at my wordbank.');
            console.log('Either way congrats!')
            return;
          }

          else{
            console.log('Guesses Left: ' + game.guessesRemaining);
            console.log('Letters already guessed: ' + lettersAlreadyGuessed);
            keepPromptingUser();
          }

        }

        else{
          game.guessesRemaining--;

          displayHangman.parseDisplay();
          console.log('Guesses Left: ' + game.guessesRemaining);
          console.log('Letters already guessed: ' + lettersAlreadyGuessed);
          keepPromptingUser();
        }
        
      }

    });
    
  }

  else{
    console.log('Not even close.');
    console.log('Better luck next time.');
    console.log('The word was "' + game.currentWrd + '" BTW.');
  }

}

game.startGame();