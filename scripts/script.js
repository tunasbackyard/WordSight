'use strict';
// words.json

// fetch('words.json')
//   .then(response => response.json())
//   .then(json => console.log(json));

const TIMER_MINUTE = 1;
const TIMER_SECOND = 0;
const INITIAL_SCORE = 0;

const DOM = {
  getElements() {
    this.startSection = document.querySelector('#start');
    this.startBtn = document.querySelector('#start-btn');
    this.letterBoxContainer = document.querySelector('.box__container');
    this.letterBox = document.querySelectorAll('.box__letter');
    this.time = document.querySelector('#time');
    this.question = document.querySelector('#question');
    this.passBtn = document.querySelector('#pass-btn');
    this.timeIsOver = document.querySelector('#end');
    this.restartBtn = document.querySelector('#to-restart-btn');
    this.restartBtnIcon = document.querySelector('#restart-btn');
    this.lastScore = document.querySelector('#to-score');
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
let timer;
writeInitTime(TIMER_MINUTE, TIMER_SECOND);

fetch('words.json')
  .then(response => response.json())
  .then(function (json) {
    let inputCount = 0;
    let userInput = '';
    const showedQuestions = [];
    DOM.startBtn.addEventListener('click', function () {
      checkQuestion(getRandomQuestionIx(), showedQuestions, json);
      DOM.startSection.classList.add('hidden');
      startTimer(TIMER_MINUTE, TIMER_SECOND);
      moveCursorToFirst();
    });
    DOM.passBtn.addEventListener('click', function () {
      checkQuestion(getRandomQuestionIx(), showedQuestions, json);
      moveCursorToFirst();
      userInput = '';
      inputCount = 0;
      clearBoxes(DOM.letterBox);
    });
    DOM.restartBtn.addEventListener('click', function () {
      resetGame(inputCount, userInput, showedQuestions, json);
      DOM.timeIsOver.classList.add('hidden');
    });
    DOM.restartBtnIcon.addEventListener('click', function () {
      resetGame(inputCount, userInput, showedQuestions, json);
    });
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
      if (areBoxesFilled(inputCount)) {
        if (isInputTrue(userInput, Question)) {
          increaseScore(1000);
          writeScore(User.score);
          clearBoxes(DOM.letterBox);
          checkQuestion(getRandomQuestionIx(), showedQuestions, json);
        } else {
          DOM.letterBox.forEach(box => inputFailAnimationHandler(box));
          clearBoxes(DOM.letterBox);
        }
        userInput = '';
        inputCount = 0;
        moveCursorToFirst();
      }
    });
  });

function resetGame(inputCount, userInput, array, json) {
  clearBoxes(DOM.letterBox);
  array.splice(0, array.length);
  checkQuestion(getRandomQuestionIx(), array, json);
  userInput = '';
  inputCount = 0;
  moveCursorToFirst();
  resetScore();
  writeScore(User.score);
  clearInterval(timer);
  writeInitTime(TIMER_MINUTE, TIMER_SECOND);
  startTimer(TIMER_MINUTE, TIMER_SECOND);
}

function writeInitTime(minute, second) {
  DOM.time.textContent = `${minute}:0${second}`;
}

function moveCursorToFirst() {
  DOM.letterBox[0].focus();
}

function focusOnRestart() {
  DOM.restartBtn.focus();
}

function isInputTrue(input, question) {
  input = input.toLowerCase();
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

async function inputFailAnimationHandler(box) {
  box.classList.add('box--fail');
  await sleep(300);
  box.classList.remove('box--fail');
}

async function scoreIncreaseAnimationHandler(element) {
  element.parentElement.classList.add('score--increase');
  await sleep(300);
  element.parentElement.classList.remove('score--increase');
}

function increaseScore(point) {
  User.score += point;
}

function resetScore() {
  User.score = 0;
}

function writeScore(score) {
  scoreIncreaseAnimationHandler(DOM.score);
  DOM.score.textContent = score;
  DOM.lastScore.textContent = score;
}

function startTimer(minute, second) {
  timer = setInterval(function () {
    if (isTimerFinished(minute, second)) {
      writeScore(User.score);
      DOM.timeIsOver.classList.remove('hidden');
      focusOnRestart();
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
  return Math.trunc(Math.random() * 20) + 1;
}

function addToShowedList(index, array) {
  array.push(index);
}

function isShowed(index, array) {
  if (array.includes(index)) {
    return true;
  }
  return false;
}

function setQuestion(index, json) {
  Question.id = json[index].id;
  Question.word = json[index].word;
  Question.description = json[index].description;
  DOM.question.textContent = Question.description;
}

function checkQuestion(index, array, json) {
  if (!isShowed(index, array)) {
    setQuestion(index, json);
    addToShowedList(index, array);
  } else {
    checkQuestion(getRandomQuestionIx(), array, json);
  }
}

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
