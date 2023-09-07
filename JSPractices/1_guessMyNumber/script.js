'use strict';

// initialize a random secret number once at the beginning
let secretNumber = Math.trunc(Math.random() * 20) + 1;
document.querySelector('.number').textContent = '?';

// initialize score from 20
let score = 20;

// intialize highScore from 0
let highScore = 0;

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

// 'Check!' button features
document.querySelector('.check').addEventListener('click', function () {
  const guess = document.querySelector('.guess').value;
  // when no number input
  if (!guess) {
    document.querySelector('.message').textContent = 'No number!';
  } // when winning
  else if (guess == secretNumber) {
    document.querySelector('.message').textContent = 'Correct Number!';

    // add more visible positive feedback to player
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    document.querySelector('.number').textContent = secretNumber;

    if (highScore < score) {
      highScore = score;
      document.querySelector('.highscore').textContent = highScore;
    }
  } // when guess is too low
  else if (guess !== secretNumber) {
    if (score > 1) {
      document.querySelector('.message').textContent =
        guess < secretNumber ? 'Too Low!' : 'Too Hight!';
      score--; //score gets deducted by 1 from each checking
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.message').textContent = 'You Lost The Game!';
      document.querySelector('.score').textContent = 0;
    }
  }
});

// 'Again' button features
document.querySelector('.again').addEventListener('click', function () {
  // reset score and re-initialize secret number
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  // reset guess content
  document.querySelector('.guess').value = '';
  // reset number content
  document.querySelector('.number').textContent = '?';
  // reset message box
  document.querySelector('.message').textContent = 'Start guessing...';
  // reset score displaying content
  document.querySelector('.score').textContent = score;
  // reset font-size of number content back to its intialization
  document.querySelector('.number').style.width = '15rem';
  // reset body's background back to its original color
  document.querySelector('body').style.backgroundColor = '#222';
});
