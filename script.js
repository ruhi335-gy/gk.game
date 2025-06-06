// Form and Popup Logic
const form = document.getElementById("nameForm");
const popup1 = document.getElementById("popup1");
const popup2 = document.getElementById("popup2");
const popup3 = document.getElementById("popup3");
const greeting = document.getElementById("greeting");
const yesBtn = document.getElementById("yesBtn");
const startBtn = document.getElementById("startBtn");

const popupWin = document.getElementById("popupWin");
const emojiGame = document.getElementById("emojiGame");
const playMoreBtn = document.getElementById("playMoreBtn");
const noThanksBtn = document.getElementById("noThanksBtn");

const feedbackPopup = document.getElementById("feedbackPopup");
const feedbackForm = document.getElementById("feedbackForm");
const thankyouPopup = document.getElementById("thankyouPopup");

// Emoji Elements
const memoryDisplay = document.getElementById("memoryDisplay");
const optionsContainer = document.getElementById("optionsContainer");
const resultText = document.getElementById("resultText");

// Game States
let memoryEmojis = [], selectedEmojis = [], consecutiveWins = 0, gameActive = true;

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("playerName").value;
  greeting.innerText = `Hey ${name}, do you want to play a game?`;
  popup1.style.display = "flex";
});

yesBtn.onclick = () => {
  popup1.style.display = "none";
  popup2.style.display = "flex";
};

startBtn.onclick = () => {
  popup2.style.display = "none";
  popup3.style.display = "flex";
  initPuzzle();
};

const puzzle = document.getElementById('puzzle');
let tiles = [], dragSrc = null;

function initPuzzle() {
  popupWin.style.display = 'none';
  puzzle.innerHTML = '';
  tiles = [];

  for (let i = 0; i < 9; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.index = i;

    const x = (i % 3) * -100;
    const y = Math.floor(i / 3) * -100;
    tile.style.backgroundPosition = `${x}px ${y}px`;

    tile.draggable = true;
    tile.addEventListener('dragstart', dragStart);
    tile.addEventListener('dragover', e => e.preventDefault());
    tile.addEventListener('drop', drop);

    tiles.push(tile);
  }

  shuffle(tiles);
  tiles.forEach(tile => puzzle.appendChild(tile));
}

function dragStart(e) {
  dragSrc = e.target;
}

function drop(e) {
  const target = e.target;
  if (dragSrc !== target) {
    const nodes = [...puzzle.children];
    const srcIndex = nodes.indexOf(dragSrc);
    const tgtIndex = nodes.indexOf(target);

    puzzle.insertBefore(dragSrc, nodes[tgtIndex]);
    puzzle.insertBefore(target, nodes[srcIndex]);

    checkWin();
  }
}

function checkWin() {
  const current = [...puzzle.children];
  if (current.every((el, i) => parseInt(el.dataset.index) === i)) {
    popupWin.style.display = 'flex';
  }
}

playMoreBtn.onclick = () => {
  popupWin.style.display = "none";
  popup3.style.display = "none";
  emojiGame.style.display = "flex";
  startEmojiGame();
};

noThanksBtn.onclick = () => {
  popupWin.style.display = "none";
  feedbackPopup.style.display = "flex";
};

feedbackForm.onsubmit = e => {
  e.preventDefault();
  feedbackPopup.style.display = "none";
  thankyouPopup.style.display = "flex";
};

// Utility
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Emoji Game Logic
const emojis = ['😀', '😂', '😍', '🤔', '😎', '😱', '🥳', '😡', '😴', '👻','🐶', '🐱', '🐵', '🍕', '🍩', '🍎', '🎮', '🚀', '💡', '🎉'];

function getRandomEmojis(count, fromArray) {
  const arr = [...fromArray];
  let result = [];
  while (result.length < count && arr.length > 0) {
    const rand = Math.floor(Math.random() * arr.length);
    result.push(arr.splice(rand, 1)[0]);
  }
  return result;
}

function startEmojiGame() {
  gameActive = true;
  memoryEmojis = getRandomEmojis(5, emojis);
  selectedEmojis = [];
  resultText.textContent = "";
  optionsContainer.innerHTML = "";
  memoryDisplay.textContent = "Memorize these emojis!";

  setTimeout(() => {
    memoryDisplay.textContent = memoryEmojis.join(" ");
  }, 500);

  setTimeout(() => {
    memoryDisplay.textContent = "Which emojis did you see?";
    showOptions();
  }, 5000);
}

function showOptions() {
  const distractors = getRandomEmojis(7, emojis.filter(e => !memoryEmojis.includes(e)));
  const allOptions = [...memoryEmojis, ...distractors].sort(() => 0.5 - Math.random());

  allOptions.forEach(emoji => {
    const btn = document.createElement("button");
    btn.textContent = emoji;
    btn.addEventListener("click", () => selectEmoji(emoji, btn));
    optionsContainer.appendChild(btn);
  });
}

function selectEmoji(emoji, btn) {
  if (selectedEmojis.includes(emoji) || !gameActive) return;
  selectedEmojis.push(emoji);
  btn.classList.add("selected");

  if (selectedEmojis.length === memoryEmojis.length) {
    setTimeout(checkEmojiResult, 600);
  }
}

function checkEmojiResult() {
  const correct = memoryEmojis.every(e => selectedEmojis.includes(e));
  if (correct) {
    consecutiveWins++;
    resultText.textContent = `✅ Excellent memory! (${consecutiveWins} in a row)`;
  } else {
    consecutiveWins = 0;
    resultText.textContent = "❌ Try again!";
  }

  if (consecutiveWins >= 3) {
    gameActive = false;
    memoryDisplay.textContent = "🎉 You won 3 times in a row! Game Over.";
    optionsContainer.innerHTML = "";

    setTimeout(() => {
      feedbackPopup.style.display = "flex";
    }, 1500);
  } else {
    setTimeout(startEmojiGame, 3000);
  }
}
