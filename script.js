let playerName = "";
let winGoal = 3;
let consecutiveWins = 0;
let gameActive = true;

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const clickSound = document.getElementById("clickSound");

function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function playCorrectSound() {
  correctSound.currentTime = 0;
  correctSound.play();
}

function playWrongSound() {
  wrongSound.currentTime = 0;
  wrongSound.play();
}

function submitName() {
  const nameInput = document.getElementById("playerName").value.trim();
  if (!nameInput) return alert("Please enter your name.");
  playerName = nameInput;
  document.getElementById("startForm").classList.add("hidden");

  // Show game question popup
  document.getElementById("questionHeading").textContent = `Hey ${playerName}, do you want to play a game?`;
  document.getElementById("popup2").classList.remove("hidden");
}

function showThankYou() {
  document.getElementById("popup2").classList.add("hidden");
  document.getElementById("popupThankYou").classList.remove("hidden");
}

function playGame() {
  document.getElementById("popup2").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  startGame();
}

function startFiveWinGame() {
  winGoal = 5;
  consecutiveWins = 0;
  gameActive = true;
  document.getElementById("popupWin3").classList.add("hidden");
  document.getElementById("gameContainer").classList.remove("hidden");
  startGame();
}

function showFeedback() {
  document.getElementById("popupWin3")?.classList.add("hidden");
  document.getElementById("popupWin5")?.classList.add("hidden");
  document.getElementById("popupThankYou")?.classList.add("hidden");

  document.getElementById("feedbackHeading").textContent = `Hey ${playerName}, please leave your feedback!`;
  document.getElementById("popupFeedback").classList.remove("hidden");
}

// Game Logic
const emojis = ['😀', '😂', '😍', '🤔', '😎', '😱', '🥳', '😡', '😴', '👻', '🐶', '🐱', '🐵', '🍕', '🍩', '🍎', '🎮', '🚀', '💡', '🎉'];

const memoryDisplay = document.getElementById("memoryDisplay");
const optionsContainer = document.getElementById("optionsContainer");
const resultText = document.getElementById("resultText");

let memoryEmojis = [];
let selectedEmojis = [];

function getRandomEmojis(count, fromArray) {
  const arr = [...fromArray];
  let result = [];
  while (result.length < count && arr.length > 0) {
    const rand = Math.floor(Math.random() * arr.length);
    result.push(arr.splice(rand, 1)[0]);
  }
  return result;
}

function startGame() {
  if (!gameActive) return;

  memoryEmojis = getRandomEmojis(5, emojis);
  selectedEmojis = [];
  resultText.textContent = "";
  optionsContainer.innerHTML = "";
  memoryDisplay.textContent = "Memorize these emojis!";

  setTimeout(() => {
    memoryDisplay.textContent = memoryEmojis.join(" ");
  }, 500);

  setTimeout(() => {
    if (!gameActive) return;
    memoryDisplay.textContent = "Which emojis did you see?";
    showOptions();
  }, 5000);
}

function showOptions() {
  const distractors = getRandomEmojis(7, emojis.filter(e => !memoryEmojis.includes(e)));
  const allOptions = [...memoryEmojis, ...distractors].sort(() => 0.5 - Math.random());

  allOptions.forEach((emoji) => {
    const btn = document.createElement("button");
    btn.textContent = emoji;
    btn.addEventListener("click", () => {
      playClickSound();
      selectEmoji(emoji, btn);
    });
    optionsContainer.appendChild(btn);
  });
}

function selectEmoji(emoji, btn) {
  if (selectedEmojis.includes(emoji) || !gameActive) return;
  selectedEmojis.push(emoji);
  btn.classList.add("selected");

  if (selectedEmojis.length === memoryEmojis.length) {
    setTimeout(checkResult, 600);
  }
}

function checkResult() {
  if (!gameActive) return;

  const correct = memoryEmojis.every(e => selectedEmojis.includes(e));
  if (correct) {
    consecutiveWins++;
    playCorrectSound();
    resultText.textContent = `✅ Great job! (${consecutiveWins} win${consecutiveWins > 1 ? 's' : ''})`;

    // Show win once popup for 3 seconds, then resume game
    showTemporaryPopup('popupWinOnce', 3000);

  } else {
    consecutiveWins = 0;
    playWrongSound();
    resultText.textContent = "❌ Try again!";

    // Show all wrong popup for 3 seconds, then resume game
    showTemporaryPopup('popupAllWrong', 3000);
  }

  if (consecutiveWins >= winGoal) {
    gameActive = false;
    optionsContainer.innerHTML = "";
    document.getElementById("gameContainer").classList.add("hidden");

    if (winGoal === 3) {
      document.getElementById("popupWin3").classList.remove("hidden");
    } else {
      document.getElementById("popupWin5").classList.remove("hidden");
    }
  }
}

function showTemporaryPopup(popupId, duration) {
  const popup = document.getElementById(popupId);
  popup.classList.remove("hidden");
  document.getElementById("gameContainer").classList.add("hidden");

  setTimeout(() => {
    popup.classList.add("hidden");
    if (consecutiveWins < winGoal) {
      document.getElementById("gameContainer").classList.remove("hidden");
      startGame();
    }
  }, duration);
}
