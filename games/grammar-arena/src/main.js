import { createSession, getWinner, isSessionOver, submitAnswer, advanceSession } from "./game.js";

const modeSelect = document.querySelector("#mode-select");
const categorySelect = document.querySelector("#category-select");
const roundSelect = document.querySelector("#round-select");
const startButton = document.querySelector("#start-button");
const modeSummary = document.querySelector("#mode-summary");
const statusMode = document.querySelector("#status-mode");
const statusRound = document.querySelector("#status-round");
const statusPlayer = document.querySelector("#status-player");
const questionPanel = document.querySelector("#question-panel");
const questionTag = document.querySelector("#question-tag");
const questionText = document.querySelector("#question-text");
const answerButtons = document.querySelector("#answer-buttons");
const feedback = document.querySelector("#feedback");
const nextButton = document.querySelector("#next-button");
const restartButton = document.querySelector("#restart-button");
const scoreboardList = document.querySelector("#scoreboard-list");
const achievementList = document.querySelector("#achievement-list");

let session = null;
let questionStart = 0;

const MODE_COPY = {
  quest: "Quest mode rewards consistency. Great for building grammar confidence round by round.",
  blitz: "Blitz mode gives bigger points for fast answers. Speed matters here.",
  pvp: "PvP Duel is pass-and-play. Two players take turns and the highest score wins."
};

function updateModeSummary() {
  modeSummary.textContent = MODE_COPY[modeSelect.value];
}

function renderScoreboard() {
  if (!session) {
    scoreboardList.innerHTML = "<p>No active game yet.</p>";
    achievementList.innerHTML = "<li>Launch a game to start earning badges.</li>";
    return;
  }

  scoreboardList.innerHTML = session.players
    .map((player, index) => {
      const activeClass = index === session.currentPlayerIndex && !isSessionOver(session) ? "active" : "";
      return `
        <article class="score-card ${activeClass}">
          <strong>${player.name}</strong>
          <p>Score: ${player.score}</p>
          <p>Correct: ${player.correct}</p>
        </article>
      `;
    })
    .join("");

  achievementList.innerHTML = session.achievements.length
    ? session.achievements.map((item) => `<li>${item}</li>`).join("")
    : "<li>Keep playing to unlock achievements.</li>";
}

function renderQuestion() {
  const question = session.deck[session.currentRound];
  questionPanel.classList.remove("idle");
  questionTag.textContent = `${session.category.toUpperCase()} CHALLENGE`;
  questionText.textContent = question.prompt;
  feedback.textContent = "";
  nextButton.disabled = true;

  answerButtons.innerHTML = question.answers
    .map(
      (answer, index) =>
        `<button class="answer-button" data-answer-index="${index}">${String.fromCharCode(
          65 + index
        )}. ${answer}</button>`
    )
    .join("");

  statusMode.textContent = `${session.mode.toUpperCase()} / ${session.category.toUpperCase()}`;
  statusRound.textContent = `${session.currentRound + 1} / ${session.rounds}`;
  statusPlayer.textContent = session.players[session.currentPlayerIndex].name;
  questionStart = performance.now();
  renderScoreboard();
}

function showEndScreen() {
  const winner = getWinner(session);
  statusRound.textContent = `${session.rounds} / ${session.rounds}`;
  statusPlayer.textContent = winner.name;
  questionTag.textContent = "MATCH COMPLETE";
  questionText.textContent =
    session.mode === "pvp"
      ? `${winner.name} wins with ${winner.score} points.`
      : `Round complete. ${winner.name} scored ${winner.score} points.`;
  answerButtons.innerHTML = "";
  feedback.textContent = "Pick a new mode or hit Launch Arena to play again.";
  nextButton.disabled = true;
  renderScoreboard();
}

function startGame() {
  session = createSession({
    mode: modeSelect.value,
    category: categorySelect.value,
    rounds: Number(roundSelect.value)
  });
  renderQuestion();
}

function handleAnswerClick(event) {
  const button = event.target.closest("[data-answer-index]");
  if (!button || !session || session.answered) {
    return;
  }

  const answerIndex = Number(button.dataset.answerIndex);
  const elapsedMs = performance.now() - questionStart;
  const result = submitAnswer(session, answerIndex, elapsedMs);
  const buttons = [...document.querySelectorAll(".answer-button")];

  buttons.forEach((answerButton, index) => {
    answerButton.disabled = true;
    if (index === result.correctIndex) {
      answerButton.classList.add("correct");
    } else if (index === answerIndex) {
      answerButton.classList.add("wrong");
    }
  });

  feedback.textContent = result.isCorrect
    ? `Correct! +${result.points} points. ${result.explanation}`
    : `Not this time. ${result.explanation}`;

  nextButton.disabled = false;
  renderScoreboard();
}

function handleNextRound() {
  if (!session || !session.answered) {
    return;
  }

  advanceSession(session);

  if (isSessionOver(session)) {
    showEndScreen();
    return;
  }

  renderQuestion();
}

function resetGame() {
  session = null;
  statusMode.textContent = "Waiting";
  statusRound.textContent = "0 / 0";
  statusPlayer.textContent = "-";
  questionPanel.classList.add("idle");
  questionTag.textContent = "Grammar Arena";
  questionText.textContent = "Choose a mode and launch a game to begin.";
  answerButtons.innerHTML = "";
  feedback.textContent = "";
  nextButton.disabled = true;
  renderScoreboard();
}

modeSelect.addEventListener("change", updateModeSummary);
startButton.addEventListener("click", startGame);
answerButtons.addEventListener("click", handleAnswerClick);
nextButton.addEventListener("click", handleNextRound);
restartButton.addEventListener("click", resetGame);

updateModeSummary();
resetGame();
