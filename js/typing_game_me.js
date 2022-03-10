const words = [
  "Hello",
  "Programming",
  "Code",
  "Javascript",
  "Town",
  "Country",
  "Testing",
  "Youtube",
  "Linkedin",
  "Twitter",
  "Github",
  "Leetcode",
  "Internet",
  "Python",
  "Scala",
  "Destructuring",
  "Paradigm",
  "Styling",
  "Cascade",
  "Documentation",
  "Coding",
  "Funny",
  "Working",
  "Dependencies",
  "Task",
  "Runner",
  "Roles",
  "Test",
  "Rust",
  "Playing",
];

// get items
let startBtn = document.querySelector(
  ".game .container .game-body  .start-btn"
);
let word = document.querySelector(".game .container .game-body .word");
let textInput = document.querySelector(".game .container .game-body input");
let wordSuggestion = document.querySelector(
  ".game .container .game-body .word-suggestions"
);
let wordSuggestionParagraph = document.querySelector(
  ".game .container .game-body .word-suggestions p"
);
let finalMessage = document.querySelector(
  ".game .container .game-body .message"
);
let finalMessageDiv = document.querySelector(
  ".game .container .game-body .message div"
);
let againBtn = document.querySelector(
  ".game .container .game-body .message .again-btn"
);
let gameLvlSpan = document.querySelector(
  ".game .container aside .game-info .game-lvl-span"
);
let gameLvlSelect = document.querySelector(
  ".game .container .game-info .game-lvl-select"
);
let secondsSpan = document.querySelector(
  ".game .container .game-info .seconds"
);

let secondsLeft = document.querySelector(
  ".game .container .footer .time-left .seconds-left"
);

let plrScore = document.querySelector(
  ".game .container .footer .score .plr-score"
);

let totalScore = [
  ...document.querySelectorAll(".game .container .footer  .total-score"),
];

let plrMostScore = document.querySelector(
  ".game .container .footer .most-score .plr-score"
);

//game levels
const levels = {
  easy: 5,
  normal: 3,
  difficult: 2,
};
let defaultLvl = localStorage.getItem("level") || "normal";

let defaultLvlSeconds = levels[defaultLvl];
changeLvl();
//choose level
mode = "not start";
gameLvlSpan.addEventListener("click", (e) => {
  if (mode == "not start") {
    e.currentTarget.parentElement.classList.add("choose");
    mode = "choose";
  } else {
    return false;
  }
});

gameLvlSelect.addEventListener("change", (e) => {
  localStorage.setItem("level", e.currentTarget.value);
  changeLvl(e.currentTarget.value);
  e.currentTarget.parentElement.classList.remove("choose");
  mode = "not start";
});

// output score
let totalScoreVar = words.length;
plrScore.innerHTML = 0;
totalScore.forEach((e) => (e.innerHTML = totalScoreVar));
let mostScore = localStorage.getItem("mostScore");
if (mostScore !== null) {
  plrMostScore.innerHTML = mostScore;
} else {
  plrMostScore.parentElement.classList.add("hidden");
}
// totalScore.innerHTML = words.length;
//start game
startBtn.addEventListener("click", (e) => {
  if (mode == "not start") {
    e.currentTarget.style.display = "none";
    mode = "start";
    textInput.focus();
    startgame();
  }
});
//start game on enter key up
window.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    if (mode === "not start") {
      startBtn.click();
    } else if (mode == "end" || mode == "win") {
      againBtn.click();
    }
  }
});

function changeLvl(lvl = defaultLvl) {
  defaultLvl = lvl;
  defaultLvlSeconds = levels[defaultLvl];
  gameLvlSpan.innerHTML = defaultLvl;
  secondsSpan.innerHTML = defaultLvlSeconds;
  secondsLeft.innerHTML = defaultLvlSeconds;
  gameLvlSelect.value = defaultLvl;
}
function startgame() {
  let randomWord = showWord();
  showSuggestions();
  let counter = defaultLvlSeconds;

  let handler = window.setInterval(() => {
    counter--;
    secondsLeft.innerHTML = counter;
    if (counter <= 0) {
      checkWord(randomWord, handler);
      if (mode == "start") {
        randomWord = showWord();
        removeWordFromSuggestions(randomWord);
        counter = defaultLvlSeconds;
        secondsLeft.innerHTML = counter;
      }
    }
    window.addEventListener("keyup", (e) => {
      if (e.code == "Enter" && textInput.value != "") {
        counter = 0;
      }
    });
  }, 1000);
}

function showWord() {
  let random = Math.trunc(Math.random() * words.length);
  let randomWord = words[random];
  word.innerHTML = randomWord;
  words.splice(random, 1);
  return randomWord;
}

function showSuggestions() {
  wordSuggestionParagraph.style.display = "none";
  words.forEach((ele) => {
    let div = document.createElement("div");
    div.innerHTML = ele;
    div.classList.add(ele);
    wordSuggestion.appendChild(div);
  });
}

function removeWordFromSuggestions(randomWord) {
  wordSuggestion.removeChild(document.querySelector("." + randomWord));
}

function checkWord(randomWord, intervalHandler) {
  inputWord = textInput.value;
  if (inputWord.toUpperCase() === randomWord.toUpperCase()) {
    mode = "start";
    increaseScore(intervalHandler);
    console.log("from check word" + intervalHandler);
    textInput.value = "";
  } else {
    window.clearInterval(intervalHandler);
    endGame();
    mode = "end";
  }
}

function increaseScore(intervalHandler) {
  let score = ++plrScore.innerHTML;

  if (score >= totalScoreVar) {
    mode = "win";
    window.clearInterval(intervalHandler);
    win();
  }
}

function win() {
  finalMessage.classList.remove("hidden");
  finalMessageDiv.innerHTML = `congratulation you got <span class='score'>${plrScore.innerHTML}</span> From <span class='score'>${totalScoreVar}</span>`;
  finalMessageDiv.classList.add("good");
  secondsLeft.innerHTML = 0;
  setMostScore();
}
function endGame() {
  finalMessage.classList.remove("hidden");
  finalMessageDiv.innerHTML = `hard luck you got <span class='score'>${plrScore.innerHTML}</span> From <span class='score'>${totalScoreVar}</span>`;
  finalMessageDiv.classList.add("bad");
  secondsLeft.innerHTML = 0;
  setMostScore();
}

function setMostScore() {
  // set most score
  if (+plrScore.innerHTML > +mostScore) {
    localStorage.setItem("mostScore", plrScore.innerHTML);
    plrMostScore.innerHTML = plrScore.innerHTML;
  }
}
