'use strict';
// words.json

// fetch('words.json')
//   .then(response => response.json())
//   .then(json => console.log(json));

const TIMER_MINUTE = 2;
const TIMER_SECOND = 0;
const INITIAL_SCORE = 0;

const DOM = {
  getElements() {
    this.startBtn = document.querySelector('#start-btn');
    this.startSection = document.querySelector('#start-section');
    this.letterBoxContainer = document.querySelector('.letter-box-container');
    this.letterBox = document.querySelectorAll('.letter-box');
    this.time = document.querySelector('#time');
    this.question = document.querySelector('#question');
    this.passBtn = document.querySelector('#pass-btn');
    this.restartBtn = document.querySelector('#to-restart-btn');
    this.timeIsOver = document.querySelector('#time-over-section');
    this.score = document.querySelector('#score');
  },
};
DOM.getElements();

const Question = {
  id: null,
  word: null,
  description: null,
};

const User = {
  score: INITIAL_SCORE,
};

fetch('words.json')
  .then(response => response.json())
  .then(function (json) {
    DOM.startBtn.addEventListener('click', function () {
      setQuestion(getRandomQuestionIx(), json);
      DOM.startSection.classList.add('hidden');
      startTimer(TIMER_MINUTE, TIMER_SECOND);
    });
    DOM.passBtn.addEventListener('click', function () {
      setQuestion(getRandomQuestionIx(), json);
      clearBoxes(DOM.letterBox);
    });
    DOM.restartBtn.addEventListener('click', function () {
      setQuestion(getRandomQuestionIx(), json);
      resetScore();
      writeScore(User.score);
      DOM.timeIsOver.classList.add('hidden');
      startTimer(TIMER_MINUTE, TIMER_SECOND);
    });
    let inputCount = 0;
    let userInput = '';
    DOM.letterBoxContainer.addEventListener('input', function (e) {
      userInput += DOM.letterBox[inputCount].value;
      inputCount += 1;
      if (
        e.target.value !== '' &&
        e.target.nextElementSibling &&
        e.target.nextElementSibling.nodeName === 'INPUT'
      ) {
        e.target.nextElementSibling.focus();
      }
      console.log(userInput, inputCount);
      if (areBoxesFilled(inputCount)) {
        if (isInputTrue(userInput, Question)) {
          increaseScore(1000);
          writeScore(User.score);
          clearBoxes(DOM.letterBox);
          setQuestion(getRandomQuestionIx(), json);
        } else {
          clearBoxes(DOM.letterBox);
        }
        userInput = '';
        inputCount = 0;
      }
    });
  });

function isInputTrue(input, question) {
  console.log(question.word);
  if (input === question.word) {
    return true;
  }
  return false;
}

function areBoxesFilled(inputCount) {
  if (inputCount === 6) {
    return true;
  }
  return false;
}

function clearBoxes(boxes) {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].value = '';
  }
}

function increaseScore(point) {
  User.score += point;
}

function resetScore() {
  User.score = 0;
}

function writeScore(score) {
  DOM.score.textContent = score;
}

function startTimer(minute, second) {
  const timer = setInterval(function () {
    if (isTimerFinished(minute, second)) {
      DOM.timeIsOver.classList.remove('hidden');
    }
    if (minute === 0 && second === 0) {
    } else {
      if (second % 60 === 0) {
        minute--;
        second = 60;
      }
      second--;
      if (second < 10) {
        if (minute !== 0) {
          DOM.time.textContent = `${minute}:0${second}`;
        } else {
          DOM.time.textContent = `${second}s`;
        }
      } else {
        DOM.time.textContent = `${minute}:${second}`;
      }
    }
  }, 1000);
}

function isTimerFinished(minute, second) {
  if (minute === 0 && second === 1) {
    return true;
  }
  return false;
}

function getRandomQuestionIx() {
  return Math.trunc(Math.random() * 11) + 1;
}

function setQuestion(index, json) {
  Question.id = json[index].id;
  Question.word = json[index].word;
  Question.description = json[index].description;
  DOM.question.textContent = Question.description;
}
